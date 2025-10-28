/**
 * Time Tracker Pro - 完整功能版
 * Created by Evan
 * 支持直接通过file://协议打开，无需服务器环境
 */

// 全局应用对象
const TimeTrackerApp = {
    // 数据模型 - 管理所有数据和存储
    dataModel: {
        currentDate: new Date(),
        records: [],
        categories: [],
        goals: [],
        charts: {}, // 存储图表实例
        
        // 初始化数据
        init() {
            // 从本地存储加载数据
            this.records = JSON.parse(localStorage.getItem('timeTrackerRecords') || '[]');
            this.categories = JSON.parse(localStorage.getItem('timeTrackerCategories') || '[]');
            this.goals = JSON.parse(localStorage.getItem('timeTrackerGoals') || '[]');
            
            // 初始化默认类别（如果为空）
            if (this.categories.length === 0) {
                this.categories = [
                    { id: '1', name: '工作', color: '#3b82f6', icon: 'briefcase' },
                    { id: '2', name: '健康', color: '#10b981', icon: 'heartbeat' },
                    { id: '3', name: '学习', color: '#f59e0b', icon: 'book' },
                    { id: '4', name: '娱乐', color: '#ec4899', icon: 'gamepad' },
                    { id: '5', name: '生活', color: '#6366f1', icon: 'home' }
                ];
                this.saveCategories();
            }
            
            // 初始化默认目标（如果为空）
            if (this.goals.length === 0) {
                this.goals = [
                    { id: '1', name: '每日工作', categoryId: '1', targetHours: 8 },
                    { id: '2', name: '每日学习', categoryId: '3', targetHours: 2 }
                ];
                this.saveGoals();
            }
        },
        
        // 日期操作
        changeDate(days) {
            this.currentDate.setDate(this.currentDate.getDate() + days);
        },
        
        // 记录操作
        addRecord(record) {
            const newRecord = { id: Date.now().toString(), ...record };
            this.records.push(newRecord);
            this.saveRecords();
            return newRecord;
        },
        
        updateRecord(id, data) {
            const index = this.records.findIndex(r => r.id === id);
            if (index !== -1) {
                this.records[index] = { ...this.records[index], ...data };
                this.saveRecords();
                return this.records[index];
            }
            return null;
        },
        
        deleteRecord(id) {
            const initialLength = this.records.length;
            this.records = this.records.filter(r => r.id !== id);
            if (this.records.length !== initialLength) {
                this.saveRecords();
                return true;
            }
            return false;
        },
        
        // 获取当前日期的记录
        getCurrentDateRecords() {
            const dateStr = this.currentDate.toISOString().split('T')[0];
            return this.records.filter(r => r.date && r.date.startsWith(dateStr));
        },
        
        // 获取指定日期范围内的记录
        getRecordsInDateRange(startDate, endDate) {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            
            return this.records.filter(r => {
                if (!r.date) return false;
                const recordDateStr = r.date.split('T')[0];
                return recordDateStr >= startStr && recordDateStr <= endStr;
            });
        },
        
        // 类别操作
        addCategory(category) {
            const newCategory = { id: Date.now().toString(), ...category };
            this.categories.push(newCategory);
            this.saveCategories();
            return newCategory;
        },
        
        updateCategory(id, data) {
            const index = this.categories.findIndex(c => c.id === id);
            if (index !== -1) {
                this.categories[index] = { ...this.categories[index], ...data };
                this.saveCategories();
                return this.categories[index];
            }
            return null;
        },
        
        deleteCategory(id) {
            // 检查是否有关联记录
            const hasRecords = this.records.some(r => r.categoryId === id);
            if (hasRecords) {
                return { success: false, reason: '该类别存在关联记录，无法删除' };
            }
            
            // 检查是否有关联目标
            const hasGoals = this.goals.some(g => g.categoryId === id);
            if (hasGoals) {
                return { success: false, reason: '该类别存在关联目标，无法删除' };
            }
            
            const initialLength = this.categories.length;
            this.categories = this.categories.filter(c => c.id !== id);
            if (this.categories.length !== initialLength) {
                this.saveCategories();
                return { success: true };
            }
            return { success: false };
        },
        
        getCategory(id) {
            return this.categories.find(c => c.id === id) || null;
        },
        
        // 目标操作
        addGoal(goal) {
            const newGoal = { id: Date.now().toString(), ...goal };
            this.goals.push(newGoal);
            this.saveGoals();
            return newGoal;
        },
        
        updateGoal(id, data) {
            const index = this.goals.findIndex(g => g.id === id);
            if (index !== -1) {
                this.goals[index] = { ...this.goals[index], ...data };
                this.saveGoals();
                return this.goals[index];
            }
            return null;
        },
        
        deleteGoal(id) {
            const initialLength = this.goals.length;
            this.goals = this.goals.filter(g => g.id !== id);
            if (this.goals.length !== initialLength) {
                this.saveGoals();
                return true;
            }
            return false;
        },
        
        // 计算类别时间分布
        calculateCategoryDistribution(range = 'day') {
            let startDate, endDate;
            const now = new Date(this.currentDate);
            
            switch (range) {
                case 'day':
                    startDate = new Date(now);
                    endDate = new Date(now);
                    break;
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - now.getDay());
                    endDate = new Date(now);
                    endDate.setDate(now.getDate() + (6 - now.getDay()));
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    break;
                default:
                    startDate = new Date(now);
                    endDate = new Date(now);
            }
            
            const records = this.getRecordsInDateRange(startDate, endDate);
            const distribution = {};
            
            // 初始化所有类别为0
            this.categories.forEach(cat => {
                distribution[cat.id] = 0;
            });
            
            // 计算每个类别的总时间（小时）
            records.forEach(record => {
                const hours = record.hours + (record.minutes / 60);
                if (distribution[record.categoryId] !== undefined) {
                    distribution[record.categoryId] += hours;
                } else {
                    distribution[record.categoryId] = hours;
                }
            });
            
            return distribution;
        },
        
        // 计算目标进度
        calculateGoalProgress() {
            const todayRecords = this.getCurrentDateRecords();
            const categoryHours = {};
            
            // 计算今日每个类别的总时间
            todayRecords.forEach(record => {
                const hours = record.hours + (record.minutes / 60);
                if (categoryHours[record.categoryId]) {
                    categoryHours[record.categoryId] += hours;
                } else {
                    categoryHours[record.categoryId] = hours;
                }
            });
            
            // 计算每个目标的进度
            return this.goals.map(goal => {
                const hoursSpent = categoryHours[goal.categoryId] || 0;
                const progress = Math.min(100, Math.round((hoursSpent / goal.targetHours) * 100));
                
                return {
                    ...goal,
                    hoursSpent,
                    progress
                };
            });
        },
        
        // 计算今日总时间
        calculateTotalTime() {
            const records = this.getCurrentDateRecords();
            let totalMinutes = 0;
            
            records.forEach(record => {
                totalMinutes += (record.hours * 60) + record.minutes;
            });
            
            return totalMinutes / 60; // 转换为小时
        },
        
        // 本地存储操作
        saveRecords() {
            localStorage.setItem('timeTrackerRecords', JSON.stringify(this.records));
        },
        saveCategories() {
            localStorage.setItem('timeTrackerCategories', JSON.stringify(this.categories));
        },
        saveGoals() {
            localStorage.setItem('timeTrackerGoals', JSON.stringify(this.goals));
        }
    },
    
    // UI渲染器 - 管理所有界面渲染
    uiRenderer: {
        // 初始化UI
        init() {
            this.renderCurrentDate();
            this.renderRecords();
            this.renderCategories();
            this.renderGoals();
            this.populateCategorySelectors();
            this.populateTimeSelectors();
            this.updateRecordDateField();
            this.renderSummaryStats();
            this.renderCategoryDistribution();
        },
        
        // 渲染当前日期
        renderCurrentDate() {
            const date = TimeTrackerApp.dataModel.currentDate;
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            document.getElementById('currentDateEvan').textContent = date.toLocaleDateString('zh-CN', options);
        },
        
        // 渲染时间记录列表
        renderRecords() {
            const records = TimeTrackerApp.dataModel.getCurrentDateRecords();
            const container = document.getElementById('recordsListEvan');
            
            if (records.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fa fa-calendar-o text-3xl mb-2 opacity-50"></i>
                        <p>暂无时间记录</p>
                        <p class="text-sm mt-1">点击"添加时间记录"开始追踪</p>
                    </div>
                `;
                return;
            }
            
            // 按时间倒序排列（最新的在前）
            const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            container.innerHTML = sortedRecords.map(record => this.createRecordElement(record)).join('');
        },
        
        // 创建单个记录元素
        createRecordElement(record) {
            const category = TimeTrackerApp.dataModel.getCategory(record.categoryId);
            return `
                <div class="record-itemEvan p-3 rounded-lg bg-white shadow-sm border-l-4 transition-all duration-300 hover:shadow-md" 
                     style="border-color: ${category?.color || '#6366f1'}">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-medium">${this.escapeHtml(record.name)}</h4>
                            <p class="text-sm text-gray-500 mt-1">
                                <i class="fa fa-${category?.icon || 'tag'} mr-1"></i>
                                ${category?.name || '未分类'}
                            </p>
                        </div>
                        <span class="font-bold">${record.hours}h${record.minutes}m</span>
                    </div>
                    ${record.notes ? `
                        <p class="text-sm text-gray-600 mt-2 italic">${this.escapeHtml(record.notes)}</p>
                    ` : ''}
                    <div class="flex gap-2 mt-3">
                        <button class="record-action-btnEvan edit text-blue-500 hover:text-blue-700 transition-colors" 
                                data-id="${record.id}" title="编辑">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="record-action-btnEvan delete text-red-500 hover:text-red-700 transition-colors" 
                                data-id="${record.id}" title="删除">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        },
        
        // 渲染类别列表
        renderCategories() {
            const categories = TimeTrackerApp.dataModel.categories;
            const container = document.getElementById('categoriesListEvan');
            
            container.innerHTML = categories.map(category => `
                <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${category.color}20">
                            <i class="fa fa-${category.icon} text-sm" style="color: ${category.color}"></i>
                        </div>
                        <span>${this.escapeHtml(category.name)}</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="category-action-btnEvan edit text-blue-500 hover:text-blue-700 transition-colors" 
                                data-id="${category.id}" title="编辑">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="category-action-btnEvan delete text-red-500 hover:text-red-700 transition-colors" 
                                data-id="${category.id}" title="删除">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        },
        
        // 渲染目标列表
        renderGoals() {
            const goalsWithProgress = TimeTrackerApp.dataModel.calculateGoalProgress();
            const container = document.getElementById('goalsListEvan');
            
            if (goalsWithProgress.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fa fa-bullseye text-3xl mb-2 opacity-50"></i>
                        <p>暂无目标</p>
                        <p class="text-sm mt-1">点击"添加目标"开始设置</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = goalsWithProgress.map(goal => {
                const category = TimeTrackerApp.dataModel.getCategory(goal.categoryId);
                const progressColor = goal.progress >= 100 ? 'text-green-500' : 'text-primary';
                
                return `
                    <div class="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h4 class="font-medium">${this.escapeHtml(goal.name)}</h4>
                                <p class="text-sm text-gray-500">
                                    <i class="fa fa-${category?.icon || 'tag'} mr-1"></i>
                                    ${category?.name || '未分类'}
                                </p>
                            </div>
                            <button class="goal-action-btnEvan delete text-red-500 hover:text-red-700 transition-colors" 
                                    data-id="${goal.id}" title="删除">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                        <div class="mt-3">
                            <div class="flex justify-between text-sm mb-1">
                                <span>今日进度</span>
                                <span class="${progressColor} font-medium">
                                    ${goal.hoursSpent.toFixed(1)}h / ${goal.targetHours}h (${goal.progress}%)
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                                     style="width: ${goal.progress}%; background-color: ${category?.color || '#6366f1'}"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        },
        
        // 渲染类别分布
        renderCategoryDistribution(range = 'day') {
            const distribution = TimeTrackerApp.dataModel.calculateCategoryDistribution(range);
            const container = document.getElementById('categoryDistributionEvan');
            
            // 计算总时间
            let totalHours = 0;
            Object.values(distribution).forEach(hours => {
                totalHours += hours;
            });
            
            if (totalHours === 0) {
                container.innerHTML = `
                    <div class="text-center py-6 text-gray-500">
                        <p>暂无数据</p>
                    </div>
                `;
                return;
            }
            
            // 按时间排序
            const sortedCategories = [...TimeTrackerApp.dataModel.categories]
                .filter(category => (distribution[category.id] || 0) > 0)
                .sort((a, b) => (distribution[b.id] || 0) - (distribution[a.id] || 0));
            
            container.innerHTML = sortedCategories.map(category => {
                const hours = distribution[category.id] || 0;
                const percentage = Math.round((hours / totalHours) * 100);
                
                return `
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${category.color}"></div>
                        <span class="text-sm flex-1">${this.escapeHtml(category.name)}</span>
                        <div class="text-right">
                            <div class="text-sm font-medium">${hours.toFixed(1)}h</div>
                            <div class="text-xs text-gray-500">${percentage}%</div>
                        </div>
                    </div>
                `;
            }).join('');
        },
        
        // 渲染汇总统计
        renderSummaryStats() {
            const totalHours = TimeTrackerApp.dataModel.calculateTotalTime();
            const remainingHours = Math.max(0, 16 - totalHours); // 假设每天清醒时间16小时
            
            document.getElementById('totalTimeEvan').textContent = `${totalHours.toFixed(1)}小时`;
            document.getElementById('remainingTimeEvan').textContent = `${remainingHours.toFixed(1)}小时`;
        },
        
        // 填充类别选择器
        populateCategorySelectors() {
            const categories = TimeTrackerApp.dataModel.categories;
            const recordSelector = document.getElementById('categorySelectEvan');
            const goalSelector = document.getElementById('goalCategorySelectEvan');
            
            // 保存当前选中值（避免重新渲染后丢失选择）
            const recordSelected = recordSelector.value;
            const goalSelected = goalSelector.value;
            
            // 清空并填充选项
            recordSelector.innerHTML = categories.map(cat => `
                <option value="${cat.id}">${this.escapeHtml(cat.name)}</option>
            `).join('');
            
            goalSelector.innerHTML = categories.map(cat => `
                <option value="${cat.id}">${this.escapeHtml(cat.name)}</option>
            `).join('');
            
            // 恢复选中值
            if (recordSelected) recordSelector.value = recordSelected;
            if (goalSelected) goalSelector.value = goalSelected;
        },
        
        // 填充时间选择器（小时和分钟）
        populateTimeSelectors() {
            const hoursSelect = document.getElementById('hoursEvan');
            const minutesSelect = document.getElementById('minutesEvan');
            
            // 填充小时（0-23）
            let hoursHtml = '';
            for (let i = 0; i <= 23; i++) {
                hoursHtml += `<option value="${i}">${i}</option>`;
            }
            hoursSelect.innerHTML = hoursHtml;
            
            // 填充分钟（0-59，间隔5分钟）
            let minutesHtml = '';
            for (let i = 0; i <= 59; i += 5) {
                minutesHtml += `<option value="${i}">${i}</option>`;
            }
            minutesSelect.innerHTML = minutesHtml;
        },
        
        // 更新记录日期字段
        updateRecordDateField() {
            const date = TimeTrackerApp.dataModel.currentDate;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('recordDateEvan').value = date.toLocaleDateString('zh-CN', options);
        },
        
        // 清空记录表单
        clearRecordForm() {
            document.getElementById('recordNameEvan').value = '';
            document.getElementById('recordNotesEvan').value = '';
            document.getElementById('hoursEvan').value = '0';
            document.getElementById('minutesEvan').value = '0';
            if (TimeTrackerApp.dataModel.categories.length > 0) {
                document.getElementById('categorySelectEvan').value = TimeTrackerApp.dataModel.categories[0].id;
            }
        },
        
        // 清空类别表单
        clearCategoryForm() {
            document.getElementById('categoryNameEvan').value = '';
            document.getElementById('categoryColorEvan').value = '#6366f1';
            document.getElementById('categoryIconEvan').value = 'briefcase';
            
            // 重置选择状态
            document.querySelectorAll('.categoryColorBtnEvan').forEach(btn => {
                btn.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                if (btn.dataset.color === '#6366f1') {
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                }
            });
            
            document.querySelectorAll('.categoryIconBtnEvan').forEach(btn => {
                btn.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                if (btn.dataset.icon === 'briefcase') {
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                }
            });
        },
        
        // 清空目标表单
        clearGoalForm() {
            document.getElementById('goalNameEvan').value = '';
            document.getElementById('goalHoursEvan').value = '1';
            if (TimeTrackerApp.dataModel.categories.length > 0) {
                document.getElementById('goalCategorySelectEvan').value = TimeTrackerApp.dataModel.categories[0].id;
            }
        },
        
        // HTML转义（防止XSS）
        escapeHtml(unsafe) {
            if (!unsafe) return '';
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    },
    
    // 图表管理器 - 管理所有图表渲染
    chartManager: {
        // 初始化图表
        init() {
            this.renderTimeDistributionChart();
            this.renderTrendAnalysisChart();
            
            // 监听窗口大小变化，重绘图表
            window.addEventListener('resize', this.throttle(() => {
                this.renderTimeDistributionChart();
                this.renderTrendAnalysisChart();
            }, 300));
        },
        
        // 渲染时间分配饼图
        renderTimeDistributionChart(range = 'day') {
            const distribution = TimeTrackerApp.dataModel.calculateCategoryDistribution(range);
            const ctx = document.getElementById('timeDistributionChartEvan').getContext('2d');
            
            // 准备图表数据
            const labels = [];
            const data = [];
            const backgroundColor = [];
            
            TimeTrackerApp.dataModel.categories.forEach(category => {
                const hours = distribution[category.id] || 0;
                if (hours > 0) {
                    labels.push(category.name);
                    data.push(hours);
                    backgroundColor.push(category.color);
                }
            });
            
            // 如果没有数据
            if (data.length === 0) {
                if (TimeTrackerApp.dataModel.charts.timeDistribution) {
                    TimeTrackerApp.dataModel.charts.timeDistribution.destroy();
                }
                
                const canvas = document.getElementById('timeDistributionChartEvan');
                const parent = canvas.parentElement;
                parent.innerHTML = `
                    <div class="h-full flex items-center justify-center text-gray-500">
                        <div class="text-center">
                            <i class="fa fa-pie-chart text-4xl mb-3 opacity-50"></i>
                            <p>暂无${this.getRangeText(range)}数据</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            // 重新创建canvas（修复图表重绘问题）
            const canvas = document.getElementById('timeDistributionChartEvan');
            if (!canvas) return;
            
            // 销毁旧图表
            if (TimeTrackerApp.dataModel.charts.timeDistribution) {
                TimeTrackerApp.dataModel.charts.timeDistribution.destroy();
            }
            
            // 创建新图表
            TimeTrackerApp.dataModel.charts.timeDistribution = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColor,
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${context.label}: ${value.toFixed(1)}h (${percentage}%)`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        },
        
        // 渲染趋势分析柱状图
        renderTrendAnalysisChart(range = 'week') {
            const ctx = document.getElementById('trendAnalysisChartEvan').getContext('2d');
            let labels = [];
            let datasets = [];
            let startDate, endDate, dateIncrement;
            
            // 根据范围设置日期参数
            const now = new Date(TimeTrackerApp.dataModel.currentDate);
            switch (range) {
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 6); // 过去7天
                    endDate = new Date(now);
                    dateIncrement = 1; // 每天
                    // 生成标签（星期几）
                    labels = this.getDateLabels(startDate, endDate, 'weekday');
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now);
                    dateIncrement = 1; // 每天
                    // 生成标签（日期）
                    labels = this.getDateLabels(startDate, endDate, 'day');
                    break;
                case 'all':
                    // 获取最早记录日期
                    const allRecords = TimeTrackerApp.dataModel.records;
                    if (allRecords.length === 0) {
                        startDate = new Date(now);
                        endDate = new Date(now);
                    } else {
                        const earliestDate = new Date(Math.min(...allRecords.map(r => new Date(r.date))));
                        startDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
                        endDate = new Date(now);
                    }
                    dateIncrement = 30; // 约每月
                    // 生成标签（月份）
                    labels = this.getDateLabels(startDate, endDate, 'month');
                    break;
            }
            
            // 准备数据集（按类别）
            const categoryData = {};
            TimeTrackerApp.dataModel.categories.forEach(category => {
                categoryData[category.id] = new Array(labels.length).fill(0);
            });
            
            // 填充数据
            labels.forEach((label, index) => {
                const [periodStart, periodEnd] = this.getPeriodDates(startDate, index, dateIncrement, range);
                const records = TimeTrackerApp.dataModel.getRecordsInDateRange(periodStart, periodEnd);
                
                records.forEach(record => {
                    const hours = record.hours + (record.minutes / 60);
                    if (categoryData[record.categoryId] && categoryData[record.categoryId][index] !== undefined) {
                        categoryData[record.categoryId][index] += hours;
                    }
                });
            });
            
            // 转换为图表数据集格式
            datasets = TimeTrackerApp.dataModel.categories
                .filter(category => categoryData[category.id].some(value => value > 0))
                .map(category => ({
                    label: category.name,
                    data: categoryData[category.id],
                    backgroundColor: category.color + '80', // 带透明度
                    borderColor: category.color,
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                }));
            
            // 如果没有数据
            if (datasets.length === 0) {
                if (TimeTrackerApp.dataModel.charts.trendAnalysis) {
                    TimeTrackerApp.dataModel.charts.trendAnalysis.destroy();
                }
                
                const canvas = document.getElementById('trendAnalysisChartEvan');
                const parent = canvas.parentElement;
                parent.innerHTML = `
                    <div class="h-full flex items-center justify-center text-gray-500">
                        <div class="text-center">
                            <i class="fa fa-bar-chart text-4xl mb-3 opacity-50"></i>
                            <p>暂无${this.getRangeText(range)}数据</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            // 销毁旧图表
            if (TimeTrackerApp.dataModel.charts.trendAnalysis) {
                TimeTrackerApp.dataModel.charts.trendAnalysis.destroy();
            }
            
            // 创建新图表
            TimeTrackerApp.dataModel.charts.trendAnalysis = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '小时'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 6
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.raw.toFixed(1)}h`;
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });
        },
        
        // 获取范围文本（用于显示）
        getRangeText(range) {
            const rangeMap = {
                'day': '今日',
                'week': '本周',
                'month': '本月',
                'all': '所有'
            };
            return rangeMap[range] || '';
        },
        
        // 生成日期标签
        getDateLabels(startDate, endDate, type) {
            const labels = [];
            const currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                if (type === 'weekday') {
                    // 显示星期几（一/二/.../日）
                    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
                    labels.push(`周${weekdays[currentDate.getDay()]}`);
                } else if (type === 'day') {
                    // 显示日期（1/2/.../31）
                    labels.push(currentDate.getDate() + '日');
                } else if (type === 'month') {
                    // 显示月份（1月/2月/.../12月）
                    labels.push(`${currentDate.getMonth() + 1}月`);
                }
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            return labels;
        },
        
        // 获取时间段的开始和结束日期
        getPeriodDates(startDate, index, increment, range) {
            const periodStart = new Date(startDate);
            
            if (range === 'all') {
                periodStart.setMonth(periodStart.getMonth() + (index * (increment / 30)));
            } else {
                periodStart.setDate(periodStart.getDate() + (index * increment));
            }
            
            const periodEnd = new Date(periodStart);
            
            if (range === 'all') {
                periodEnd.setMonth(periodEnd.getMonth() + 1);
                periodEnd.setDate(0); // 当月最后一天
            } else {
                periodEnd.setDate(periodEnd.getDate() + increment - 1);
            }
            
            return [periodStart, periodEnd];
        },
        
        // 节流函数
        throttle(func, limit) {
            let lastCall = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastCall >= limit) {
                    lastCall = now;
                    func.apply(this, args);
                }
            };
        }
    },
    
    // 模态框管理器
    modalManager: {
        // 打开模态框
        open(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        // 关闭模态框
        close(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    },
    
    // 通知管理器
    notificationManager: {
        // 显示通知
        show(message, type = 'success') {
            const notification = document.getElementById('notification');
            const textElement = document.getElementById('notificationText');
            
            // 设置类型样式
            notification.className = 'notification';
            notification.classList.add(type);
            
            // 设置消息
            textElement.textContent = message;
            
            // 显示通知
            notification.classList.add('show');
            
            // 3秒后自动隐藏
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    },
    
    // 数据导出管理器
    exportManager: {
        // 导出所有数据为JSON
        exportAllData() {
            const exportData = {
                records: TimeTrackerApp.dataModel.records,
                categories: TimeTrackerApp.dataModel.categories,
                goals: TimeTrackerApp.dataModel.goals,
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            this.downloadFile(
                'time-tracker-export-' + this.formatDate(new Date()) + '.json',
                'application/json',
                JSON.stringify(exportData, null, 2)
            );
        },
        
        // 导出今日记录为CSV
        exportDailyRecordsCSV() {
            const records = TimeTrackerApp.dataModel.getCurrentDateRecords();
            this.exportRecordsCSV(records, 'today');
        },
        
        // 导出本周记录为CSV
        exportWeekRecordsCSV() {
            const now = new Date(TimeTrackerApp.dataModel.currentDate);
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            const endDate = new Date(now);
            endDate.setDate(now.getDate() + (6 - now.getDay()));
            
            const records = TimeTrackerApp.dataModel.getRecordsInDateRange(startDate, endDate);
            this.exportRecordsCSV(records, 'week');
        },
        
        // 导出类别分布为CSV
        exportCategoryDistributionCSV() {
            const distribution = TimeTrackerApp.dataModel.calculateCategoryDistribution('month');
            const headers = ['类别', '小时数', '百分比'];
            
            let csvContent = headers.join(',') + '\n';
            
            // 计算总时间
            let totalHours = 0;
            Object.values(distribution).forEach(hours => {
                totalHours += hours;
            });
            
            // 按时间排序
            const sortedCategories = [...TimeTrackerApp.dataModel.categories]
                .filter(category => (distribution[category.id] || 0) > 0)
                .sort((a, b) => (distribution[b.id] || 0) - (distribution[a.id] || 0));
            
            sortedCategories.forEach(category => {
                const hours = distribution[category.id] || 0;
                const percentage = totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0;
                
                const row = [
                    this.escapeCSVValue(category.name),
                    hours.toFixed(1),
                    percentage + '%'
                ];
                
                csvContent += row.join(',') + '\n';
            });
            
            this.downloadFile(
                `time-tracker-category-distribution-${this.formatDate(new Date())}.csv`,
                'text/csv',
                csvContent
            );
        },
        
        // 导出记录为CSV
        exportRecordsCSV(records, rangeType) {
            const headers = ['日期', '事项名称', '类别', '小时', '分钟', '备注'];
            
            let csvContent = headers.join(',') + '\n';
            
            records.forEach(record => {
                const category = TimeTrackerApp.dataModel.getCategory(record.categoryId);
                const row = [
                    this.formatDate(new Date(record.date)),
                    this.escapeCSVValue(record.name),
                    this.escapeCSVValue(category ? category.name : ''),
                    record.hours,
                    record.minutes,
                    this.escapeCSVValue(record.notes || '')
                ];
                
                csvContent += row.join(',') + '\n';
            });
            
            this.downloadFile(
                `time-tracker-${rangeType}-${this.formatDate(new Date())}.csv`,
                'text/csv',
                csvContent
            );
        },
        
        // 下载文件
        downloadFile(filename, contentType, content) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        },
        
        // 格式化日期
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        
        // 转义CSV值
        escapeCSVValue(value) {
            if (typeof value !== 'string') {
                return value;
            }
            
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
        }
    },
    
    // 事件处理器
    eventHandler: {
        currentEditingId: null,
        
        // 初始化事件绑定
        init() {
            this.bindDateNavigation();
            this.bindModalEvents();
            this.bindRecordActions();
            this.bindCategoryActions();
            this.bindGoalActions();
            this.bindChartRangeEvents();
            this.bindDeleteEvents();
            this.bindExportEvents();
            this.bindCancelEvents();
        },
        
        // 绑定日期导航事件
        bindDateNavigation() {
            document.getElementById('prevDayEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.dataModel.changeDate(-1);
                this.updateUIAfterDateChange();
            });
            
            document.getElementById('nextDayEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.dataModel.changeDate(1);
                this.updateUIAfterDateChange();
            });
        },
        
        // 绑定模态框事件
        bindModalEvents() {
            // 添加记录
            document.getElementById('addRecordEvanBtn').addEventListener('click', () => {
                this.currentEditingId = null;
                TimeTrackerApp.uiRenderer.clearRecordForm();
                TimeTrackerApp.modalManager.open('addRecordEvanModal');
            });
            
            // 添加类别
            document.getElementById('addCategoryEvanBtn').addEventListener('click', () => {
                this.currentEditingId = null;
                TimeTrackerApp.uiRenderer.clearCategoryForm();
                TimeTrackerApp.modalManager.open('addCategoryEvanModal');
            });
            
            // 添加目标
            document.getElementById('addGoalEvanBtn').addEventListener('click', () => {
                this.currentEditingId = null;
                TimeTrackerApp.uiRenderer.clearGoalForm();
                TimeTrackerApp.modalManager.open('addGoalEvanModal');
            });
            
            // 导出数据
            document.getElementById('exportDataEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.open('exportDataEvanModal');
            });
            
            // 颜色选择
            document.querySelectorAll('.categoryColorBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.categoryColorBtnEvan').forEach(b => {
                        b.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                    });
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                    document.getElementById('categoryColorEvan').value = btn.dataset.color;
                });
            });
            
            // 图标选择
            document.querySelectorAll('.categoryIconBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.categoryIconBtnEvan').forEach(b => {
                        b.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                    });
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                    document.getElementById('categoryIconEvan').value = btn.dataset.icon;
                });
            });
        },
        
        // 绑定记录操作事件
        bindRecordActions() {
            document.getElementById('recordsListEvan').addEventListener('click', (e) => {
                const editBtn = e.target.closest('.record-action-btnEvan.edit');
                const deleteBtn = e.target.closest('.record-action-btnEvan.delete');
                
                if (editBtn) {
                    const recordId = editBtn.dataset.id;
                    this.handleEditRecord(recordId);
                } else if (deleteBtn) {
                    const recordId = deleteBtn.dataset.id;
                    this.handleDeleteItem(recordId, 'record');
                }
            });
            
            // 保存记录
            document.getElementById('saveRecordEvanBtn').addEventListener('click', () => {
                this.handleSaveRecord();
            });
        },
        
        // 绑定类别操作事件
        bindCategoryActions() {
            document.getElementById('categoriesListEvan').addEventListener('click', (e) => {
                const editBtn = e.target.closest('.category-action-btnEvan.edit');
                const deleteBtn = e.target.closest('.category-action-btnEvan.delete');
                
                if (editBtn) {
                    const categoryId = editBtn.dataset.id;
                    this.handleEditCategory(categoryId);
                } else if (deleteBtn) {
                    const categoryId = deleteBtn.dataset.id;
                    this.handleDeleteItem(categoryId, 'category');
                }
            });
            
            // 保存类别
            document.getElementById('saveCategoryEvanBtn').addEventListener('click', () => {
                this.handleSaveCategory();
            });
        },
        
        // 绑定目标操作事件
        bindGoalActions() {
            document.getElementById('goalsListEvan').addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.goal-action-btnEvan.delete');
                
                if (deleteBtn) {
                    const goalId = deleteBtn.dataset.id;
                    this.handleDeleteItem(goalId, 'goal');
                }
            });
            
            // 保存目标
            document.getElementById('saveGoalEvanBtn').addEventListener('click', () => {
                this.handleSaveGoal();
            });
        },
        
        // 绑定图表范围事件
        bindChartRangeEvents() {
            // 时间分配图表
            document.querySelectorAll('.timeRangeBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.timeRangeBtnEvan').forEach(b => {
                        b.classList.remove('active', 'bg-primary', 'text-white');
                        b.classList.add('bg-gray-100');
                    });
                    btn.classList.add('active', 'bg-primary', 'text-white');
                    btn.classList.remove('bg-gray-100');
                    
                    const range = btn.dataset.range;
                    TimeTrackerApp.chartManager.renderTimeDistributionChart(range);
                    TimeTrackerApp.uiRenderer.renderCategoryDistribution(range);
                });
            });
            
            // 趋势分析图表
            document.querySelectorAll('.trendRangeBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.trendRangeBtnEvan').forEach(b => {
                        b.classList.remove('active', 'bg-primary', 'text-white');
                        b.classList.add('bg-gray-100');
                    });
                    btn.classList.add('active', 'bg-primary', 'text-white');
                    btn.classList.remove('bg-gray-100');
                    
                    const range = btn.dataset.range;
                    TimeTrackerApp.chartManager.renderTrendAnalysisChart(range);
                });
            });
        },
        
        // 绑定删除事件
        bindDeleteEvents() {
            document.getElementById('confirmDeleteEvanBtn').addEventListener('click', () => {
                const itemId = document.getElementById('deleteItemIdEvan').value;
                const itemType = document.getElementById('deleteItemTypeEvan').value;
                
                if (itemId && itemType) {
                    this.processDeletion(itemId, itemType);
                }
            });
        },
        
        // 绑定导出事件
        bindExportEvents() {
            document.getElementById('exportAllJsonEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.exportManager.exportAllData();
                TimeTrackerApp.modalManager.close('exportDataEvanModal');
                TimeTrackerApp.notificationManager.show('所有数据已导出为JSON格式');
            });
            
            document.getElementById('exportTodayCsvEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.exportManager.exportDailyRecordsCSV();
                TimeTrackerApp.modalManager.close('exportDataEvanModal');
                TimeTrackerApp.notificationManager.show('今日记录已导出为CSV格式');
            });
            
            document.getElementById('exportWeekCsvEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.exportManager.exportWeekRecordsCSV();
                TimeTrackerApp.modalManager.close('exportDataEvanModal');
                TimeTrackerApp.notificationManager.show('本周记录已导出为CSV格式');
            });
            
            document.getElementById('exportCategoryCsvEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.exportManager.exportCategoryDistributionCSV();
                TimeTrackerApp.modalManager.close('exportDataEvanModal');
                TimeTrackerApp.notificationManager.show('类别分布已导出为CSV格式');
            });
        },
        
        // 绑定取消按钮事件
        bindCancelEvents() {
            // 记录表单取消
            document.getElementById('recordCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.close('addRecordEvanModal');
            });
            
            // 类别表单取消
            document.getElementById('categoryCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.close('addCategoryEvanModal');
            });
            
            // 目标表单取消
            document.getElementById('goalCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.close('addGoalEvanModal');
            });
            
            // 导出取消
            document.getElementById('exportCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.close('exportDataEvanModal');
            });
            
            // 删除取消
            document.getElementById('deleteCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.modalManager.close('deleteConfirmEvanModal');
            });
        },
        
        // 处理记录编辑
        handleEditRecord(recordId) {
            const record = TimeTrackerApp.dataModel.records.find(r => r.id === recordId);
            if (!record) return;
            
            this.currentEditingId = recordId;
            
            // 填充表单
            document.getElementById('recordNameEvan').value = record.name || '';
            document.getElementById('categorySelectEvan').value = record.categoryId || '';
            document.getElementById('hoursEvan').value = record.hours || '0';
            document.getElementById('minutesEvan').value = record.minutes || '0';
            document.getElementById('recordNotesEvan').value = record.notes || '';
            
            TimeTrackerApp.modalManager.open('addRecordEvanModal');
        },
        
        // 处理类别编辑
        handleEditCategory(categoryId) {
            const category = TimeTrackerApp.dataModel.getCategory(categoryId);
            if (!category) return;
            
            this.currentEditingId = categoryId;
            
            // 填充表单
            document.getElementById('categoryNameEvan').value = category.name || '';
            document.getElementById('categoryColorEvan').value = category.color || '#6366f1';
            document.getElementById('categoryIconEvan').value = category.icon || 'briefcase';
            
            // 更新选择状态
            document.querySelectorAll('.categoryColorBtnEvan').forEach(btn => {
                btn.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                if (btn.dataset.color === category.color) {
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                }
            });
            
            document.querySelectorAll('.categoryIconBtnEvan').forEach(btn => {
                btn.classList.remove('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                if (btn.dataset.icon === category.icon) {
                    btn.classList.add('selected', 'ring-2', 'ring-primary', 'ring-offset-2');
                }
            });
            
            TimeTrackerApp.modalManager.open('addCategoryEvanModal');
        },
        
        // 处理删除确认
        handleDeleteItem(itemId, itemType) {
            document.getElementById('deleteItemIdEvan').value = itemId;
            document.getElementById('deleteItemTypeEvan').value = itemType;
            TimeTrackerApp.modalManager.open('deleteConfirmEvanModal');
        },
        
        // 执行删除操作
        processDeletion(itemId, itemType) {
            let success = false;
            let message = '';
            
            switch (itemType) {
                case 'record':
                    success = TimeTrackerApp.dataModel.deleteRecord(itemId);
                    message = success ? '时间记录已删除' : '删除失败';
                    break;
                case 'category':
                    const result = TimeTrackerApp.dataModel.deleteCategory(itemId);
                    success = result.success;
                    message = success ? '类别已删除' : result.reason || '删除失败';
                    break;
                case 'goal':
                    success = TimeTrackerApp.dataModel.deleteGoal(itemId);
                    message = success ? '目标已删除' : '删除失败';
                    break;
            }
            
            if (success) {
                TimeTrackerApp.modalManager.close('deleteConfirmEvanModal');
                this.updateUIAfterDataChange();
                TimeTrackerApp.notificationManager.show(message);
            } else {
                TimeTrackerApp.notificationManager.show(message, 'error');
            }
        },
        
        // 处理记录保存
        handleSaveRecord() {
            const name = document.getElementById('recordNameEvan').value.trim();
            const categoryId = document.getElementById('categorySelectEvan').value;
            const hours = document.getElementById('hoursEvan').value;
            const minutes = document.getElementById('minutesEvan').value;
            const notes = document.getElementById('recordNotesEvan').value.trim();
            
            // 验证
            if (!name) {
                TimeTrackerApp.notificationManager.show('请输入事项名称', 'error');
                return;
            }
            
            if (!categoryId) {
                TimeTrackerApp.notificationManager.show('请选择类别', 'error');
                return;
            }
            
            if (parseInt(hours) === 0 && parseInt(minutes) === 0) {
                TimeTrackerApp.notificationManager.show('时长不能为0', 'error');
                return;
            }
            
            const recordData = {
                name,
                categoryId,
                hours: parseInt(hours),
                minutes: parseInt(minutes),
                notes,
                date: TimeTrackerApp.dataModel.currentDate.toISOString()
            };
            
            let success = false;
            let message = '';
            
            if (this.currentEditingId) {
                success = TimeTrackerApp.dataModel.updateRecord(this.currentEditingId, recordData) !== null;
                message = success ? '时间记录已更新' : '更新失败';
            } else {
                success = TimeTrackerApp.dataModel.addRecord(recordData) !== null;
                message = success ? '时间记录已添加' : '添加失败';
            }
            
            if (success) {
                TimeTrackerApp.modalManager.close('addRecordEvanModal');
                TimeTrackerApp.uiRenderer.clearRecordForm();
                this.updateUIAfterDataChange();
                TimeTrackerApp.notificationManager.show(message);
            } else {
                TimeTrackerApp.notificationManager.show(message, 'error');
            }
        },
        
        // 处理类别保存
        handleSaveCategory() {
            const name = document.getElementById('categoryNameEvan').value.trim();
            const color = document.getElementById('categoryColorEvan').value;
            const icon = document.getElementById('categoryIconEvan').value;
            
            if (!name) {
                TimeTrackerApp.notificationManager.show('请输入类别名称', 'error');
                return;
            }
            
            const categoryData = { name, color, icon };
            let success = false;
            let message = '';
            
            if (this.currentEditingId) {
                success = TimeTrackerApp.dataModel.updateCategory(this.currentEditingId, categoryData) !== null;
                message = success ? '类别已更新' : '更新失败';
            } else {
                success = TimeTrackerApp.dataModel.addCategory(categoryData) !== null;
                message = success ? '类别已添加' : '添加失败';
            }
            
            if (success) {
                TimeTrackerApp.modalManager.close('addCategoryEvanModal');
                TimeTrackerApp.uiRenderer.clearCategoryForm();
                this.updateUIAfterDataChange();
                TimeTrackerApp.notificationManager.show(message);
            } else {
                TimeTrackerApp.notificationManager.show(message, 'error');
            }
        },
        
        // 处理目标保存
        handleSaveGoal() {
            const name = document.getElementById('goalNameEvan').value.trim();
            const categoryId = document.getElementById('goalCategorySelectEvan').value;
            const targetHours = parseFloat(document.getElementById('goalHoursEvan').value);
            
            if (!name) {
                TimeTrackerApp.notificationManager.show('请输入目标名称', 'error');
                return;
            }
            
            if (!categoryId) {
                TimeTrackerApp.notificationManager.show('请选择类别', 'error');
                return;
            }
            
            if (isNaN(targetHours) || targetHours <= 0) {
                TimeTrackerApp.notificationManager.show('请输入有效的目标时长', 'error');
                return;
            }
            
            const goalData = { name, categoryId, targetHours };
            let success = false;
            let message = '';
            
            if (this.currentEditingId) {
                success = TimeTrackerApp.dataModel.updateGoal(this.currentEditingId, goalData) !== null;
                message = success ? '目标已更新' : '更新失败';
            } else {
                success = TimeTrackerApp.dataModel.addGoal(goalData) !== null;
                message = success ? '目标已添加' : '添加失败';
            }
            
            if (success) {
                TimeTrackerApp.modalManager.close('addGoalEvanModal');
                TimeTrackerApp.uiRenderer.clearGoalForm();
                this.updateUIAfterDataChange();
                TimeTrackerApp.notificationManager.show(message);
            } else {
                TimeTrackerApp.notificationManager.show(message, 'error');
            }
        },
        
        // 日期变更后更新UI
        updateUIAfterDateChange() {
            TimeTrackerApp.uiRenderer.renderCurrentDate();
            TimeTrackerApp.uiRenderer.renderRecords();
            TimeTrackerApp.uiRenderer.renderCategoryDistribution();
            TimeTrackerApp.uiRenderer.renderSummaryStats();
            TimeTrackerApp.uiRenderer.updateRecordDateField();
            TimeTrackerApp.chartManager.renderTimeDistributionChart();
        },
        
        // 数据变更后更新UI
        updateUIAfterDataChange() {
            TimeTrackerApp.uiRenderer.renderRecords();
            TimeTrackerApp.uiRenderer.renderCategories();
            TimeTrackerApp.uiRenderer.renderGoals();
            TimeTrackerApp.uiRenderer.renderCategoryDistribution();
            TimeTrackerApp.uiRenderer.renderSummaryStats();
            TimeTrackerApp.uiRenderer.populateCategorySelectors();
            TimeTrackerApp.chartManager.renderTimeDistributionChart();
            TimeTrackerApp.chartManager.renderTrendAnalysisChart();
        }
    },
    
    // 初始化应用
    init() {
        this.dataModel.init();
        this.uiRenderer.init();
        this.chartManager.init();
        this.eventHandler.init();
    }
};

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', () => {
    TimeTrackerApp.init();
});