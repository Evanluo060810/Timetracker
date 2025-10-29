/**
 * Time Tracker Pro - 完整功能版
 * Created by Evan
 * 支持直接通过file://协议打开，无需服务器环境
 */

// 国际化文本 - Evan水印
const i18n = {
    zh: {
        appTitle: "时间跟踪器 Pro",
        appSubtitle: "高效管理你的每一分钟",
        exportBtnText: "导出数据",
        addRecordBtnText: "添加时间记录",
        todayRecordsTitle: "今日时间记录",
        totalTimeLabel: "今日总计时间：",
        remainingTimeLabel: "剩余清醒时间：",
        categoriesTitle: "类别管理",
        addCategoryBtnText: "添加新类别",
        timeDistributionTitle: "时间分配",
        rangeDayText: "今日",
        rangeWeekText: "本周",
        rangeMonthText: "本月",
        trendAnalysisTitle: "趋势分析",
        trendWeekText: "本周",
        trendMonthText: "本月",
        trendAllText: "全部",
        goalTrackingTitle: "目标追踪",
        addGoalBtnText: "添加目标",
        addRecordModalTitle: "添加时间记录",
        recordNameLabel: "事项名称",
        categoryLabel: "所属类别",
        durationLabel: "时长",
        hoursText: "小时",
        minutesText: "分钟",
        dateLabel: "日期",
        notesLabel: "备注（可选）",
        cancelText: "取消",
        saveText: "保存记录",
        addCategoryModalTitle: "添加新类别",
        categoryNameLabel: "类别名称",
        selectColorLabel: "选择颜色",
        selectIconLabel: "选择图标",
        cancelText2: "取消",
        saveCategoryText: "保存类别",
        addGoalModalTitle: "添加新目标",
        goalNameLabel: "目标名称",
        goalCategoryLabel: "所属类别",
        dailyGoalLabel: "每日目标时长（小时）",
        cancelText3: "取消",
        saveGoalText: "保存目标",
        exportDataTitle: "导出数据",
        exportDataDesc: "选择导出格式和范围",
        exportAllJsonText: "导出所有数据（JSON）",
        exportTodayCsvText: "导出今日记录（CSV）",
        exportWeekCsvText: "导出本周记录（CSV）",
        exportCategoryCsvText: "导出类别分布（CSV）",
        cancelText4: "取消",
        confirmDeleteTitle: "确认删除",
        confirmDeleteDesc: "你确定要删除这个项目吗？此操作无法撤销。",
        cancelText5: "取消",
        confirmDeleteBtnText: "确认删除",
        langText: "中文"
    },
    en: {
        appTitle: "Time Tracker Pro",
        appSubtitle: "Efficiently manage every minute",
        exportBtnText: "Export Data",
        addRecordBtnText: "Add Time Record",
        todayRecordsTitle: "Today's Records",
        totalTimeLabel: "Total time today:",
        remainingTimeLabel: "Remaining awake time:",
        categoriesTitle: "Category Management",
        addCategoryBtnText: "Add New Category",
        timeDistributionTitle: "Time Distribution",
        rangeDayText: "Today",
        rangeWeekText: "Week",
        rangeMonthText: "Month",
        trendAnalysisTitle: "Trend Analysis",
        trendWeekText: "This Week",
        trendMonthText: "This Month",
        trendAllText: "All Time",
        goalTrackingTitle: "Goal Tracking",
        addGoalBtnText: "Add Goal",
        addRecordModalTitle: "Add Time Record",
        recordNameLabel: "Record Name",
        categoryLabel: "Category",
        durationLabel: "Duration",
        hoursText: "hours",
        minutesText: "minutes",
        dateLabel: "Date",
        notesLabel: "Notes (optional)",
        cancelText: "Cancel",
        saveText: "Save Record",
        addCategoryModalTitle: "Add New Category",
        categoryNameLabel: "Category Name",
        selectColorLabel: "Select Color",
        selectIconLabel: "Select Icon",
        cancelText2: "Cancel",
        saveCategoryText: "Save Category",
        addGoalModalTitle: "Add New Goal",
        goalNameLabel: "Goal Name",
        goalCategoryLabel: "Category",
        dailyGoalLabel: "Daily Target Hours",
        cancelText3: "Cancel",
        saveGoalText: "Save Goal",
        exportDataTitle: "Export Data",
        exportDataDesc: "Select export format and range",
        exportAllJsonText: "Export All Data (JSON)",
        exportTodayCsvText: "Export Today's Records (CSV)",
        exportWeekCsvText: "Export This Week's Records (CSV)",
        exportCategoryCsvText: "Export Category Distribution (CSV)",
        cancelText4: "Cancel",
        confirmDeleteTitle: "Confirm Delete",
        confirmDeleteDesc: "Are you sure you want to delete this item? This action cannot be undone.",
        cancelText5: "Cancel",
        confirmDeleteBtnText: "Confirm Delete",
        langText: "English"
    }
};

// 全局应用对象 - Evan水印
const TimeTrackerApp = {
    // 当前语言
    currentLang: 'zh',
    // 当前主题
    currentTheme: 'light',
    
    // 数据模型 - 管理所有数据和存储 - Evan水印
    dataModel: {
        currentDate: new Date(),
        records: [],
        categories: [],
        goals: [],
        charts: {}, // 存储图表实例
        
        // 初始化数据 - Evan水印
        init() {
            // 从本地存储加载数据
            this.records = JSON.parse(localStorage.getItem('timeTrackerRecords') || '[]');
            this.categories = JSON.parse(localStorage.getItem('timeTrackerCategories') || '[]');
            this.goals = JSON.parse(localStorage.getItem('timeTrackerGoals') || '[]');
            
            // 初始化默认类别（如果为空）
            if (this.categories.length === 0) {
                this.categories = [
                    { id: '1', name: TimeTrackerApp.currentLang === 'zh' ? '工作' : 'Work', color: '#3b82f6', icon: 'briefcase' },
                    { id: '2', name: TimeTrackerApp.currentLang === 'zh' ? '健康' : 'Health', color: '#10b981', icon: 'heartbeat' },
                    { id: '3', name: TimeTrackerApp.currentLang === 'zh' ? '学习' : 'Study', color: '#f59e0b', icon: 'book' },
                    { id: '4', name: TimeTrackerApp.currentLang === 'zh' ? '娱乐' : 'Entertainment', color: '#ec4899', icon: 'gamepad' },
                    { id: '5', name: TimeTrackerApp.currentLang === 'zh' ? '生活' : 'Life', color: '#6366f1', icon: 'home' }
                ];
                this.saveCategories();
            }
            
            // 初始化默认目标（如果为空）
            if (this.goals.length === 0) {
                this.goals = [
                    { id: '1', name: TimeTrackerApp.currentLang === 'zh' ? '每日工作' : 'Daily Work', categoryId: '1', targetHours: 8 },
                    { id: '2', name: TimeTrackerApp.currentLang === 'zh' ? '每日学习' : 'Daily Study', categoryId: '3', targetHours: 2 }
                ];
                this.saveGoals();
            }
        },
        
        // 日期操作 - Evan水印
        changeDate(days) {
            this.currentDate.setDate(this.currentDate.getDate() + days);
        },
        
        // 记录操作 - Evan水印
        addRecord(record) {
            const newRecord = { id: Date.now().toString(), ...record };
            this.records.push(newRecord);
            this.saveRecords();
            return newRecord;
        },
        
        // 更新记录 - Evan水印
        updateRecord(id, data) {
            const index = this.records.findIndex(r => r.id === id);
            if (index !== -1) {
                this.records[index] = { ...this.records[index], ...data };
                this.saveRecords();
                return this.records[index];
            }
            return null;
        },
        
        // 删除记录 - Evan水印
        deleteRecord(id) {
            const initialLength = this.records.length;
            this.records = this.records.filter(r => r.id !== id);
            if (this.records.length !== initialLength) {
                this.saveRecords();
                return true;
            }
            return false;
        },
        
        // 获取当前日期的记录 - Evan水印
        getCurrentDateRecords() {
            const dateStr = this.currentDate.toISOString().split('T')[0];
            return this.records.filter(r => r.date && r.date.startsWith(dateStr));
        },
        
        // 获取指定日期范围内的记录 - Evan水印
        getRecordsInDateRange(startDate, endDate) {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            
            return this.records.filter(r => {
                if (!r.date) return false;
                const recordDateStr = r.date.split('T')[0];
                return recordDateStr >= startStr && recordDateStr <= endStr;
            });
        },
        
        // 添加类别 - Evan水印
        addCategory(category) {
            const newCategory = { id: Date.now().toString(), ...category };
            this.categories.push(newCategory);
            this.saveCategories();
            return newCategory;
        },
        
        // 更新类别 - Evan水印
        updateCategory(id, data) {
            const index = this.categories.findIndex(c => c.id === id);
            if (index !== -1) {
                this.categories[index] = { ...this.categories[index], ...data };
                this.saveCategories();
                return this.categories[index];
            }
            return null;
        },
        
        // 删除类别 - Evan水印
        deleteCategory(id) {
            // 检查是否有关联记录
            const hasRecords = this.records.some(r => r.categoryId === id);
            if (hasRecords) {
                return { 
                    success: false, 
                    reason: TimeTrackerApp.currentLang === 'zh' ? '该类别存在关联记录，无法删除' : 'This category has associated records and cannot be deleted' 
                };
            }
            
            // 检查是否有关联目标
            const hasGoals = this.goals.some(g => g.categoryId === id);
            if (hasGoals) {
                return { 
                    success: false, 
                    reason: TimeTrackerApp.currentLang === 'zh' ? '该类别存在关联目标，无法删除' : 'This category has associated goals and cannot be deleted' 
                };
            }
            
            const initialLength = this.categories.length;
            this.categories = this.categories.filter(c => c.id !== id);
            if (this.categories.length !== initialLength) {
                this.saveCategories();
                return { success: true };
            }
            return { success: false };
        },
        
        // 获取类别 - Evan水印
        getCategory(id) {
            return this.categories.find(c => c.id === id) || null;
        },
        
        // 添加目标 - Evan水印
        addGoal(goal) {
            const newGoal = { id: Date.now().toString(), ...goal };
            this.goals.push(newGoal);
            this.saveGoals();
            return newGoal;
        },
        
        // 更新目标 - Evan水印
        updateGoal(id, data) {
            const index = this.goals.findIndex(g => g.id === id);
            if (index !== -1) {
                this.goals[index] = { ...this.goals[index], ...data };
                this.saveGoals();
                return this.goals[index];
            }
            return null;
        },
        
        // 删除目标 - Evan水印
        deleteGoal(id) {
            const initialLength = this.goals.length;
            this.goals = this.goals.filter(g => g.id !== id);
            if (this.goals.length !== initialLength) {
                this.saveGoals();
                return true;
            }
            return false;
        },
        
        // 计算类别时间分布 - Evan水印
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
        
        // 计算目标进度 - Evan水印
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
        
        // 计算今日总时间 - Evan水印
        calculateTotalTime() {
            const records = this.getCurrentDateRecords();
            let totalMinutes = 0;
            
            records.forEach(record => {
                totalMinutes += (record.hours * 60) + record.minutes;
            });
            
            return totalMinutes / 60; // 转换为小时
        },
        
        // 本地存储操作 - Evan水印
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
    
    // UI渲染器 - 管理所有界面渲染 - Evan水印
    uiRenderer: {
        // 初始化UI - Evan水印
        init() {
            this.renderCurrentDate();
            this.renderRecords();
            this.renderCategories();
            this.renderGoals();
            this.populateCategorySelectors();
            this.populateTimeSelectors();
            this.renderCharts();
            this.setRecordDateField();
            this.updateTotalTime();
            this.applySavedTheme();
            this.applySavedLanguage();
        },
        
        // 渲染当前日期 - Evan水印
        renderCurrentDate() {
            const options = TimeTrackerApp.currentLang === 'zh' 
                ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
                : { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', weekday: 'long' };
                
            const dateStr = TimeTrackerApp.dataModel.currentDate.toLocaleDateString(
                TimeTrackerApp.currentLang === 'zh' ? 'zh-CN' : 'en-US', 
                options
            );
            document.getElementById('currentDateEvan').textContent = dateStr;
        },
        
        // 渲染记录列表 - Evan水印
        renderRecords() {
            const recordsList = document.getElementById('recordsListEvan');
            const records = TimeTrackerApp.dataModel.getCurrentDateRecords();
            
            if (records.length === 0) {
                recordsList.innerHTML = `
                    <div class="text-center py-8 light:text-light-textSecondary dark:text-dark-textSecondary">
                        <i class="fa fa-calendar-o text-3xl mb-2"></i>
                        <p>${TimeTrackerApp.currentLang === 'zh' ? '今日暂无记录' : 'No records for today'}</p>
                    </div>
                `;
                return;
            }
            
            recordsList.innerHTML = '';
            records.forEach(record => {
                const category = TimeTrackerApp.dataModel.getCategory(record.categoryId);
                if (!category) return;
                
                const recordEl = document.createElement('div');
                recordEl.className = 'p-3 rounded-lg light:bg-light-bg dark:bg-dark-bg border light:border-light-border dark:border-dark-border flex justify-between items-center theme-transition';
                recordEl.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: ${category.color}20; color: ${category.color}">
                            <i class="fa fa-${category.icon}"></i>
                        </div>
                        <div>
                            <h4 class="font-medium">${record.name}</h4>
                            <p class="text-sm light:text-light-textSecondary dark:text-dark-textSecondary">${category.name} · ${record.hours}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'}${record.minutes}${TimeTrackerApp.currentLang === 'zh' ? '分钟' : 'm'}</p>
                            ${record.notes ? `<p class="text-xs mt-1 light:text-light-textSecondary dark:text-dark-textSecondary">${record.notes}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="editRecordEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${record.id}">
                            <i class="fa fa-pencil light:text-light-text dark:text-dark-text"></i>
                        </button>
                        <button class="deleteRecordEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${record.id}" data-type="record">
                            <i class="fa fa-trash light:text-light-text dark:text-dark-text"></i>
                        </button>
                    </div>
                `;
                recordsList.appendChild(recordEl);
            });
        },
        
        // 渲染类别列表 - Evan水印
        renderCategories() {
            const categoriesList = document.getElementById('categoriesListEvan');
            const categories = TimeTrackerApp.dataModel.categories;
            
            categoriesList.innerHTML = '';
            categories.forEach(category => {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'p-3 rounded-lg light:bg-light-bg dark:bg-dark-bg border light:border-light-border dark:border-dark-border flex justify-between items-center theme-transition';
                categoryEl.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full" style="background-color: ${category.color}"></div>
                        <div class="flex items-center gap-2">
                            <i class="fa fa-${category.icon} light:text-light-text dark:text-dark-text"></i>
                            <span>${category.name}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="editCategoryEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${category.id}">
                            <i class="fa fa-pencil light:text-light-text dark:text-dark-text"></i>
                        </button>
                        <button class="deleteCategoryEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${category.id}" data-type="category">
                            <i class="fa fa-trash light:text-light-text dark:text-dark-text"></i>
                        </button>
                    </div>
                `;
                categoriesList.appendChild(categoryEl);
            });
        },
        
        // 渲染目标列表 - Evan水印
        renderGoals() {
            const goalsList = document.getElementById('goalsListEvan');
            const goals = TimeTrackerApp.dataModel.calculateGoalProgress();
            
            if (goals.length === 0) {
                goalsList.innerHTML = `
                    <div class="text-center py-8 light:text-light-textSecondary dark:text-dark-textSecondary">
                        <i class="fa fa-bullseye text-3xl mb-2"></i>
                        <p>${TimeTrackerApp.currentLang === 'zh' ? '暂无目标，添加一个新目标吧' : 'No goals yet, add a new goal'}</p>
                    </div>
                `;
                return;
            }
            
            goalsList.innerHTML = '';
            goals.forEach(goal => {
                const category = TimeTrackerApp.dataModel.getCategory(goal.categoryId);
                if (!category) return;
                
                const goalEl = document.createElement('div');
                goalEl.className = 'p-4 rounded-lg light:bg-light-bg dark:bg-dark-bg border light:border-light-border dark:border-dark-border theme-transition';
                goalEl.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-medium flex items-center gap-2">
                                <i class="fa fa-${category.icon}" style="color: ${category.color}"></i>
                                ${goal.name}
                            </h4>
                            <p class="text-sm light:text-light-textSecondary dark:text-dark-textSecondary">
                                ${category.name} · ${goal.hoursSpent.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'} / ${goal.targetHours}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button class="editGoalEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${goal.id}">
                                <i class="fa fa-pencil light:text-light-text dark:text-dark-text"></i>
                            </button>
                            <button class="deleteGoalEvanBtn p-2 rounded-full hover:light:bg-gray-100 hover:dark:bg-gray-700 transition-colors" data-id="${goal.id}" data-type="goal">
                                <i class="fa fa-trash light:text-light-text dark:text-dark-text"></i>
                            </button>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div class="h-2.5 rounded-full" style="width: ${goal.progress}%; background-color: ${category.color}"></div>
                    </div>
                    <div class="flex justify-end mt-1">
                        <span class="text-sm font-medium" style="color: ${category.color}">${goal.progress}%</span>
                    </div>
                `;
                goalsList.appendChild(goalEl);
            });
        },
        
        // 填充类别选择器 - Evan水印
        populateCategorySelectors() {
            const categorySelect = document.getElementById('categorySelectEvan');
            const goalCategorySelect = document.getElementById('goalCategorySelectEvan');
            const categories = TimeTrackerApp.dataModel.categories;
            
            // 清空现有选项
            categorySelect.innerHTML = '';
            goalCategorySelect.innerHTML = '';
            
            // 添加默认选项
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = TimeTrackerApp.currentLang === 'zh' ? '选择类别' : 'Select category';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            
            const defaultOption2 = defaultOption.cloneNode(true);
            
            categorySelect.appendChild(defaultOption);
            goalCategorySelect.appendChild(defaultOption2);
            
            // 添加类别选项
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                
                const option2 = option.cloneNode(true);
                
                categorySelect.appendChild(option);
                goalCategorySelect.appendChild(option2);
            });
        },
        
        // 填充时间选择器 - Evan水印
        populateTimeSelectors() {
            const hoursSelect = document.getElementById('hoursEvan');
            const minutesSelect = document.getElementById('minutesEvan');
            
            // 填充小时选项
            hoursSelect.innerHTML = '';
            for (let i = 0; i <= 23; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                hoursSelect.appendChild(option);
            }
            
            // 填充分钟选项
            minutesSelect.innerHTML = '';
            for (let i = 0; i < 60; i += 5) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                minutesSelect.appendChild(option);
            }
        },
        
        // 设置记录日期字段 - Evan水印
        setRecordDateField() {
            const dateInput = document.getElementById('recordDateEvan');
            const dateStr = TimeTrackerApp.dataModel.currentDate.toISOString().split('T')[0];
            dateInput.value = dateStr;
        },
        
        // 更新总时间显示 - Evan水印
        updateTotalTime() {
            const totalHours = TimeTrackerApp.dataModel.calculateTotalTime();
            const remainingHours = Math.max(0, 16 - totalHours); // 假设每天清醒16小时
            
            document.getElementById('totalTimeEvan').textContent = `${totalHours.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'}`;
            document.getElementById('remainingTimeEvan').textContent = `${remainingHours.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'}`;
        },
        
        // 渲染图表 - Evan水印
        renderCharts() {
            this.renderTimeDistributionChart();
            this.renderTrendAnalysisChart();
        },
        
        // 渲染时间分布图表 - Evan水印
        renderTimeDistributionChart() {
            const ctx = document.getElementById('timeDistributionChartEvan').getContext('2d');
            const distribution = TimeTrackerApp.dataModel.calculateCategoryDistribution(
                document.querySelector('.timeRangeBtnEvan.active')?.dataset.range || 'day'
            );
            
            // 准备图表数据
            const labels = [];
            const data = [];
            const backgroundColor = [];
            
            Object.keys(distribution).forEach(categoryId => {
                const category = TimeTrackerApp.dataModel.getCategory(categoryId);
                if (!category || distribution[categoryId] <= 0) return;
                
                labels.push(category.name);
                data.push(distribution[categoryId]);
                backgroundColor.push(category.color);
            });
            
            // 销毁现有图表
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
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                    return `${context.label}: ${value.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
            
            // 更新类别分布列表
            this.updateCategoryDistribution(distribution);
        },
        
        // 更新类别分布列表 - Evan水印
        updateCategoryDistribution(distribution) {
            const container = document.getElementById('categoryDistributionEvan');
            container.innerHTML = '';
            
            // 转换为数组并排序
            const distributionArray = Object.entries(distribution)
                .map(([categoryId, hours]) => ({ categoryId, hours }))
                .sort((a, b) => b.hours - a.hours);
            
            distributionArray.forEach(({ categoryId, hours }) => {
                const category = TimeTrackerApp.dataModel.getCategory(categoryId);
                if (!category || hours <= 0) return;
                
                const total = Object.values(distribution).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((hours / total) * 100) : 0;
                
                const item = document.createElement('div');
                item.className = 'flex flex-col';
                item.innerHTML = `
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background-color: ${category.color}"></div>
                            <span class="text-sm">${category.name}</span>
                        </div>
                        <span class="text-sm font-medium">${hours.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'} (${percentage}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div class="h-1.5 rounded-full" style="width: ${percentage}%; background-color: ${category.color}"></div>
                    </div>
                `;
                container.appendChild(item);
            });
        },
        
        // 渲染趋势分析图表 - Evan水印
        renderTrendAnalysisChart() {
            const ctx = document.getElementById('trendAnalysisChartEvan').getContext('2d');
            const range = document.querySelector('.trendRangeBtnEvan.active')?.dataset.range || 'week';
            
            // 确定日期范围
            let dates = [];
            const today = new Date(TimeTrackerApp.dataModel.currentDate);
            
            if (range === 'week') {
                // 过去7天
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    dates.push(date);
                }
            } else if (range === 'month') {
                // 过去30天
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    dates.push(date);
                }
            } else {
                // 所有记录的日期，去重并排序
                const recordDates = [...new Set(TimeTrackerApp.dataModel.records.map(r => r.date?.split('T')[0]))]
                    .filter(d => d)
                    .sort();
                dates = recordDates.map(d => new Date(d));
            }
            
            // 准备图表数据
            const labels = dates.map(date => {
                return TimeTrackerApp.currentLang === 'zh'
                    ? `${date.getMonth() + 1}/${date.getDate()}`
                    : `${date.getMonth() + 1}/${date.getDate()}`;
            });
            
            const data = dates.map(date => {
                const start = new Date(date);
                const end = new Date(date);
                end.setDate(end.getDate() + 1);
                
                const dayRecords = TimeTrackerApp.dataModel.getRecordsInDateRange(start, end);
                return dayRecords.reduce((total, record) => {
                    return total + record.hours + (record.minutes / 60);
                }, 0);
            });
            
            // 销毁现有图表
            if (TimeTrackerApp.dataModel.charts.trendAnalysis) {
                TimeTrackerApp.dataModel.charts.trendAnalysis.destroy();
            }
            
            // 创建新图表
            TimeTrackerApp.dataModel.charts.trendAnalysis = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: TimeTrackerApp.currentLang === 'zh' ? '小时' : 'Hours',
                        data: data,
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.raw.toFixed(1)}${TimeTrackerApp.currentLang === 'zh' ? '小时' : 'h'}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: TimeTrackerApp.currentTheme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + (TimeTrackerApp.currentLang === 'zh' ? 'h' : 'h');
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        
        // 显示通知 - Evan水印
        showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notification.className = `notification ${type} light:bg-white dark:bg-dark-card theme-transition`;
            notificationText.textContent = message;
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        },
        
        // 显示模态框 - Evan水印
        showModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        
        // 隐藏模态框 - Evan水印
        hideModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            document.body.style.overflow = '';
        },
        
        // 清空模态框表单 - Evan水印
        clearModalForms() {
            // 清空记录表单
            document.getElementById('recordNameEvan').value = '';
            document.getElementById('categorySelectEvan').value = '';
            document.getElementById('hoursEvan').value = '0';
            document.getElementById('minutesEvan').value = '0';
            document.getElementById('recordNotesEvan').value = '';
            
            // 清空类别表单
            document.getElementById('categoryNameEvan').value = '';
            document.getElementById('categoryColorEvan').value = '#6366f1';
            document.getElementById('categoryIconEvan').value = 'briefcase';
            document.querySelectorAll('.categoryColorBtnEvan').forEach(btn => btn.classList.remove('selected'));
            document.querySelectorAll('.categoryIconBtnEvan').forEach(btn => btn.classList.remove('selected'));
            document.querySelector(`.categoryColorBtnEvan[data-color="#6366f1"]`).classList.add('selected');
            document.querySelector(`.categoryIconBtnEvan[data-icon="briefcase"]`).classList.add('selected');
            
            // 清空目标表单
            document.getElementById('goalNameEvan').value = '';
            document.getElementById('goalCategorySelectEvan').value = '';
            document.getElementById('goalHoursEvan').value = '1';
            
            // 重置表单状态
            document.getElementById('editRecordIdEvan').value = '';
            document.getElementById('editCategoryIdEvan').value = '';
            document.getElementById('editGoalIdEvan').value = '';
        },
        
        // 应用保存的主题 - Evan水印
        applySavedTheme() {
            const savedTheme = localStorage.getItem('timeTrackerTheme') || 'light';
            TimeTrackerApp.currentTheme = savedTheme;
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        },
        
        // 切换主题 - Evan水印
        toggleTheme() {
            const newTheme = TimeTrackerApp.currentTheme === 'light' ? 'dark' : 'light';
            TimeTrackerApp.currentTheme = newTheme;
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            localStorage.setItem('timeTrackerTheme', newTheme);
            
            // 重新渲染图表以适应新主题
            this.renderCharts();
        },
        
        // 应用保存的语言 - Evan水印
        applySavedLanguage() {
            const savedLang = localStorage.getItem('timeTrackerLang') || 'zh';
            TimeTrackerApp.currentLang = savedLang;
            this.updateLanguageText();
        },
        
        // 切换语言 - Evan水印
        toggleLanguage() {
            const newLang = TimeTrackerApp.currentLang === 'zh' ? 'en' : 'zh';
            TimeTrackerApp.currentLang = newLang;
            localStorage.setItem('timeTrackerLang', newLang);
            this.updateLanguageText();
            
            // 更新类别和目标的名称
            this.updateLocalizedNames();
            
            // 重新渲染所有内容
            this.init();
        },
        
        // 更新界面语言文本 - Evan水印
        updateLanguageText() {
            // 更新标题和副标题
            document.querySelector('h1').innerHTML = `<i class="fa fa-clock-o" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].appTitle}`;
            document.querySelector('header p').textContent = i18n[TimeTrackerApp.currentLang].appSubtitle;
            
            // 更新按钮文本
            document.getElementById('exportDataEvanBtn').innerHTML = `<i class="fa fa-download" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].exportBtnText}`;
            document.getElementById('addRecordEvanBtn').innerHTML = `<i class="fa fa-plus" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].addRecordBtnText}`;
            document.querySelector('h3:nth-of-type(1)').innerHTML = `<i class="fa fa-list-alt text-primary" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].todayRecordsTitle}`;
            document.querySelector('#totalTimeEvan').parentNode.querySelector('span:first-child').textContent = i18n[TimeTrackerApp.currentLang].totalTimeLabel;
            document.querySelector('#remainingTimeEvan').parentNode.querySelector('span:first-child').textContent = i18n[TimeTrackerApp.currentLang].remainingTimeLabel;
            document.querySelector('h3:nth-of-type(2)').innerHTML = `<i class="fa fa-tags text-primary" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].categoriesTitle}`;
            document.getElementById('addCategoryEvanBtn').innerHTML = `<i class="fa fa-plus" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].addCategoryBtnText}`;
            document.querySelector('h3:nth-of-type(3)').innerHTML = `<i class="fa fa-pie-chart text-primary" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].timeDistributionTitle}`;
            document.querySelectorAll('.timeRangeBtnEvan')[0].textContent = i18n[TimeTrackerApp.currentLang].rangeDayText;
            document.querySelectorAll('.timeRangeBtnEvan')[1].textContent = i18n[TimeTrackerApp.currentLang].rangeWeekText;
            document.querySelectorAll('.timeRangeBtnEvan')[2].textContent = i18n[TimeTrackerApp.currentLang].rangeMonthText;
            document.querySelector('h3:nth-of-type(4)').innerHTML = `<i class="fa fa-line-chart text-primary" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].trendAnalysisTitle}`;
            document.querySelectorAll('.trendRangeBtnEvan')[0].textContent = i18n[TimeTrackerApp.currentLang].trendWeekText;
            document.querySelectorAll('.trendRangeBtnEvan')[1].textContent = i18n[TimeTrackerApp.currentLang].trendMonthText;
            document.querySelectorAll('.trendRangeBtnEvan')[2].textContent = i18n[TimeTrackerApp.currentLang].trendAllText;
            document.querySelector('h3:nth-of-type(5)').innerHTML = `<i class="fa fa-bullseye text-primary" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].goalTrackingTitle}`;
            document.getElementById('addGoalEvanBtn').innerHTML = `<i class="fa fa-plus" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].addGoalBtnText}`;
            
            // 更新模态框文本
            document.querySelector('#addRecordEvanModal h3').textContent = i18n[TimeTrackerApp.currentLang].addRecordModalTitle;
            document.querySelector('#recordNameEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].recordNameLabel;
            document.querySelector('#categorySelectEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].categoryLabel;
            document.querySelector('#hoursEvan').parentNode.parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].durationLabel;
            document.querySelector('#recordDateEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].dateLabel;
            document.querySelector('#recordNotesEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].notesLabel;
            document.getElementById('recordCancelEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].cancelText;
            document.getElementById('saveRecordEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].saveText;
            
            document.querySelector('#addCategoryEvanModal h3').textContent = i18n[TimeTrackerApp.currentLang].addCategoryModalTitle;
            document.querySelector('#categoryNameEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].categoryNameLabel;
            document.querySelector('#categoryColorEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].selectColorLabel;
            document.querySelector('#categoryIconEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].selectIconLabel;
            document.getElementById('categoryCancelEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].cancelText2;
            document.getElementById('saveCategoryEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].saveCategoryText;
            
            document.querySelector('#addGoalEvanModal h3').textContent = i18n[TimeTrackerApp.currentLang].addGoalModalTitle;
            document.querySelector('#goalNameEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].goalNameLabel;
            document.querySelector('#goalCategorySelectEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].goalCategoryLabel;
            document.querySelector('#goalHoursEvan').parentNode.querySelector('label').textContent = i18n[TimeTrackerApp.currentLang].dailyGoalLabel;
            document.getElementById('goalCancelEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].cancelText3;
            document.getElementById('saveGoalEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].saveGoalText;
            
            document.querySelector('#exportDataEvanModal h3').textContent = i18n[TimeTrackerApp.currentLang].exportDataTitle;
            document.querySelector('#exportDataEvanModal p').textContent = i18n[TimeTrackerApp.currentLang].exportDataDesc;
            document.getElementById('exportAllJsonEvanBtn').innerHTML = `<i class="fa fa-file-code-o text-gray-700" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].exportAllJsonText}`;
            document.getElementById('exportTodayCsvEvanBtn').innerHTML = `<i class="fa fa-file-text-o text-gray-700" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].exportTodayCsvText}`;
            document.getElementById('exportWeekCsvEvanBtn').innerHTML = `<i class="fa fa-file-text-o text-gray-700" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].exportWeekCsvText}`;
            document.getElementById('exportCategoryCsvEvanBtn').innerHTML = `<i class="fa fa-file-text-o text-gray-700" aria-hidden="true"></i> ${i18n[TimeTrackerApp.currentLang].exportCategoryCsvText}`;
            document.getElementById('exportCancelEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].cancelText4;
            
            document.querySelector('#deleteConfirmEvanModal h3').textContent = i18n[TimeTrackerApp.currentLang].confirmDeleteTitle;
            document.querySelector('#deleteConfirmEvanModal p').textContent = i18n[TimeTrackerApp.currentLang].confirmDeleteDesc;
            document.getElementById('deleteCancelEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].cancelText5;
            document.getElementById('confirmDeleteEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].confirmDeleteBtnText;
            
            // 更新语言切换按钮
            document.getElementById('langToggleEvanBtn').textContent = i18n[TimeTrackerApp.currentLang].langText;
        },
        
        // 更新本地化名称（类别和目标）- Evan水印
        updateLocalizedNames() {
            // 更新默认类别名称
            if (TimeTrackerApp.dataModel.categories.length === 5) {
                TimeTrackerApp.dataModel.categories[0].name = TimeTrackerApp.currentLang === 'zh' ? '工作' : 'Work';
                TimeTrackerApp.dataModel.categories[1].name = TimeTrackerApp.currentLang === 'zh' ? '健康' : 'Health';
                TimeTrackerApp.dataModel.categories[2].name = TimeTrackerApp.currentLang === 'zh' ? '学习' : 'Study';
                TimeTrackerApp.dataModel.categories[3].name = TimeTrackerApp.currentLang === 'zh' ? '娱乐' : 'Entertainment';
                TimeTrackerApp.dataModel.categories[4].name = TimeTrackerApp.currentLang === 'zh' ? '生活' : 'Life';
                TimeTrackerApp.dataModel.saveCategories();
            }
            
            // 更新默认目标名称
            if (TimeTrackerApp.dataModel.goals.length === 2) {
                TimeTrackerApp.dataModel.goals[0].name = TimeTrackerApp.currentLang === 'zh' ? '每日工作' : 'Daily Work';
                TimeTrackerApp.dataModel.goals[1].name = TimeTrackerApp.currentLang === 'zh' ? '每日学习' : 'Daily Study';
                TimeTrackerApp.dataModel.saveGoals();
            }
        }
    },
    
    // 事件处理器 - 管理所有用户交互 - Evan水印
    eventHandler: {
        // 初始化事件监听 - Evan水印
        init() {
            this.initDateNavigation();
            this.initRecordModals();
            this.initCategoryModals();
            this.initGoalModals();
            this.initExportModal();
            this.initDeleteModal();
            this.initRangeButtons();
            this.initThemeToggle();
            this.initLanguageToggle();
        },
        
        // 初始化日期导航 - Evan水印
        initDateNavigation() {
            document.getElementById('prevDayEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.dataModel.changeDate(-1);
                TimeTrackerApp.uiRenderer.renderCurrentDate();
                TimeTrackerApp.uiRenderer.renderRecords();
                TimeTrackerApp.uiRenderer.setRecordDateField();
                TimeTrackerApp.uiRenderer.updateTotalTime();
                TimeTrackerApp.uiRenderer.renderCharts();
            });
            
            document.getElementById('nextDayEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.dataModel.changeDate(1);
                TimeTrackerApp.uiRenderer.renderCurrentDate();
                TimeTrackerApp.uiRenderer.renderRecords();
                TimeTrackerApp.uiRenderer.setRecordDateField();
                TimeTrackerApp.uiRenderer.updateTotalTime();
                TimeTrackerApp.uiRenderer.renderCharts();
            });
        },
        
        // 初始化记录模态框 - Evan水印
        initRecordModals() {
            // 打开添加记录模态框
            document.getElementById('addRecordEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.clearModalForms();
                TimeTrackerApp.uiRenderer.showModal('addRecordEvanModal');
            });
            
            // 关闭记录模态框
            document.getElementById('recordCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.hideModal('addRecordEvanModal');
            });
            
            // 保存记录
            document.getElementById('saveRecordEvanBtn').addEventListener('click', () => {
                const name = document.getElementById('recordNameEvan').value.trim();
                const categoryId = document.getElementById('categorySelectEvan').value;
                const hours = parseInt(document.getElementById('hoursEvan').value);
                const minutes = parseInt(document.getElementById('minutesEvan').value);
                const date = document.getElementById('recordDateEvan').value;
                const notes = document.getElementById('recordNotesEvan').value.trim();
                const editId = document.getElementById('editRecordIdEvan').value;
                
                if (!name || !categoryId || (hours === 0 && minutes === 0)) {
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '请填写必要的字段' : 'Please fill in the required fields', 
                        'error'
                    );
                    return;
                }
                
                const recordData = { name, categoryId, hours, minutes, date, notes };
                
                if (editId) {
                    // 更新现有记录
                    TimeTrackerApp.dataModel.updateRecord(editId, recordData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '记录已更新' : 'Record updated'
                    );
                } else {
                    // 添加新记录
                    TimeTrackerApp.dataModel.addRecord(recordData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '记录已添加' : 'Record added'
                    );
                }
                
                TimeTrackerApp.uiRenderer.hideModal('addRecordEvanModal');
                TimeTrackerApp.uiRenderer.renderRecords();
                TimeTrackerApp.uiRenderer.updateTotalTime();
                TimeTrackerApp.uiRenderer.renderCharts();
            });
            
            // 编辑记录
            document.getElementById('recordsListEvan').addEventListener('click', (e) => {
                if (e.target.closest('.editRecordEvanBtn')) {
                    const id = e.target.closest('.editRecordEvanBtn').dataset.id;
                    const record = TimeTrackerApp.dataModel.records.find(r => r.id === id);
                    
                    if (record) {
                        document.getElementById('recordNameEvan').value = record.name;
                        document.getElementById('categorySelectEvan').value = record.categoryId;
                        document.getElementById('hoursEvan').value = record.hours;
                        document.getElementById('minutesEvan').value = record.minutes;
                        document.getElementById('recordDateEvan').value = record.date.split('T')[0];
                        document.getElementById('recordNotesEvan').value = record.notes || '';
                        document.getElementById('editRecordIdEvan').value = id;
                        
                        TimeTrackerApp.uiRenderer.showModal('addRecordEvanModal');
                    }
                }
                
                // 删除记录
                if (e.target.closest('.deleteRecordEvanBtn')) {
                    const id = e.target.closest('.deleteRecordEvanBtn').dataset.id;
                    const type = e.target.closest('.deleteRecordEvanBtn').dataset.type;
                    
                    document.getElementById('deleteItemIdEvan').value = id;
                    document.getElementById('deleteItemTypeEvan').value = type;
                    TimeTrackerApp.uiRenderer.showModal('deleteConfirmEvanModal');
                }
            });
        },
        
        // 初始化类别模态框 - Evan水印
        initCategoryModals() {
            // 打开添加类别模态框
            document.getElementById('addCategoryEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.clearModalForms();
                document.getElementById('addCategoryEvanModal').querySelector('h3').textContent = i18n[TimeTrackerApp.currentLang].addCategoryModalTitle;
                document.getElementById('editCategoryIdEvan').value = '';
                TimeTrackerApp.uiRenderer.showModal('addCategoryEvanModal');
            });
            
            // 关闭类别模态框
            document.getElementById('categoryCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.hideModal('addCategoryEvanModal');
            });
            
            // 保存类别
            document.getElementById('saveCategoryEvanBtn').addEventListener('click', () => {
                const name = document.getElementById('categoryNameEvan').value.trim();
                const color = document.getElementById('categoryColorEvan').value;
                const icon = document.getElementById('categoryIconEvan').value;
                const editId = document.getElementById('editCategoryIdEvan').value;
                
                if (!name || !color || !icon) {
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '请填写必要的字段' : 'Please fill in the required fields', 
                        'error'
                    );
                    return;
                }
                
                const categoryData = { name, color, icon };
                
                if (editId) {
                    // 更新现有类别
                    TimeTrackerApp.dataModel.updateCategory(editId, categoryData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '类别已更新' : 'Category updated'
                    );
                } else {
                    // 添加新类别
                    TimeTrackerApp.dataModel.addCategory(categoryData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '类别已添加' : 'Category added'
                    );
                }
                
                TimeTrackerApp.uiRenderer.hideModal('addCategoryEvanModal');
                TimeTrackerApp.uiRenderer.renderCategories();
                TimeTrackerApp.uiRenderer.populateCategorySelectors();
                TimeTrackerApp.uiRenderer.renderGoals();
                TimeTrackerApp.uiRenderer.renderCharts();
            });
            
            // 颜色选择按钮
            document.querySelectorAll('.categoryColorBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.categoryColorBtnEvan').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    document.getElementById('categoryColorEvan').value = btn.dataset.color;
                });
            });
            
            // 图标选择按钮
            document.querySelectorAll('.categoryIconBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.categoryIconBtnEvan').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    document.getElementById('categoryIconEvan').value = btn.dataset.icon;
                });
            });
            
            // 编辑和删除类别
            document.getElementById('categoriesListEvan').addEventListener('click', (e) => {
                if (e.target.closest('.editCategoryEvanBtn')) {
                    const id = e.target.closest('.editCategoryEvanBtn').dataset.id;
                    const category = TimeTrackerApp.dataModel.getCategory(id);
                    
                    if (category) {
                        document.getElementById('categoryNameEvan').value = category.name;
                        document.getElementById('categoryColorEvan').value = category.color;
                        document.getElementById('categoryIconEvan').value = category.icon;
                        document.getElementById('editCategoryIdEvan').value = id;
                        
                        // 更新选中状态
                        document.querySelectorAll('.categoryColorBtnEvan').forEach(b => b.classList.remove('selected'));
                        document.querySelectorAll('.categoryIconBtnEvan').forEach(b => b.classList.remove('selected'));
                        document.querySelector(`.categoryColorBtnEvan[data-color="${category.color}"]`).classList.add('selected');
                        document.querySelector(`.categoryIconBtnEvan[data-icon="${category.icon}"]`).classList.add('selected');
                        
                        document.getElementById('addCategoryEvanModal').querySelector('h3').textContent = TimeTrackerApp.currentLang === 'zh' ? '编辑类别' : 'Edit Category';
                        TimeTrackerApp.uiRenderer.showModal('addCategoryEvanModal');
                    }
                }
                
                if (e.target.closest('.deleteCategoryEvanBtn')) {
                    const id = e.target.closest('.deleteCategoryEvanBtn').dataset.id;
                    const type = e.target.closest('.deleteCategoryEvanBtn').dataset.type;
                    
                    document.getElementById('deleteItemIdEvan').value = id;
                    document.getElementById('deleteItemTypeEvan').value = type;
                    TimeTrackerApp.uiRenderer.showModal('deleteConfirmEvanModal');
                }
            });
        },
        
        // 初始化目标模态框 - Evan水印
        initGoalModals() {
            // 打开添加目标模态框
            document.getElementById('addGoalEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.clearModalForms();
                document.getElementById('addGoalEvanModal').querySelector('h3').textContent = i18n[TimeTrackerApp.currentLang].addGoalModalTitle;
                document.getElementById('editGoalIdEvan').value = '';
                TimeTrackerApp.uiRenderer.showModal('addGoalEvanModal');
            });
            
            // 关闭目标模态框
            document.getElementById('goalCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.hideModal('addGoalEvanModal');
            });
            
            // 保存目标
            document.getElementById('saveGoalEvanBtn').addEventListener('click', () => {
                const name = document.getElementById('goalNameEvan').value.trim();
                const categoryId = document.getElementById('goalCategorySelectEvan').value;
                const targetHours = parseFloat(document.getElementById('goalHoursEvan').value);
                const editId = document.getElementById('editGoalIdEvan').value;
                
                if (!name || !categoryId || !targetHours || targetHours <= 0) {
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '请填写必要的字段' : 'Please fill in the required fields', 
                        'error'
                    );
                    return;
                }
                
                const goalData = { name, categoryId, targetHours };
                
                if (editId) {
                    // 更新现有目标
                    TimeTrackerApp.dataModel.updateGoal(editId, goalData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '目标已更新' : 'Goal updated'
                    );
                } else {
                    // 添加新目标
                    TimeTrackerApp.dataModel.addGoal(goalData);
                    TimeTrackerApp.uiRenderer.showNotification(
                        TimeTrackerApp.currentLang === 'zh' ? '目标已添加' : 'Goal added'
                    );
                }
                
                TimeTrackerApp.uiRenderer.hideModal('addGoalEvanModal');
                TimeTrackerApp.uiRenderer.renderGoals();
            });
            
            // 编辑和删除目标
            document.getElementById('goalsListEvan').addEventListener('click', (e) => {
                if (e.target.closest('.editGoalEvanBtn')) {
                    const id = e.target.closest('.editGoalEvanBtn').dataset.id;
                    const goal = TimeTrackerApp.dataModel.goals.find(g => g.id === id);
                    
                    if (goal) {
                        document.getElementById('goalNameEvan').value = goal.name;
                        document.getElementById('goalCategorySelectEvan').value = goal.categoryId;
                        document.getElementById('goalHoursEvan').value = goal.targetHours;
                        document.getElementById('editGoalIdEvan').value = id;
                        
                        document.getElementById('addGoalEvanModal').querySelector('h3').textContent = TimeTrackerApp.currentLang === 'zh' ? '编辑目标' : 'Edit Goal';
                        TimeTrackerApp.uiRenderer.showModal('addGoalEvanModal');
                    }
                }
                
                if (e.target.closest('.deleteGoalEvanBtn')) {
                    const id = e.target.closest('.deleteGoalEvanBtn').dataset.id;
                    const type = e.target.closest('.deleteGoalEvanBtn').dataset.type;
                    
                    document.getElementById('deleteItemIdEvan').value = id;
                    document.getElementById('deleteItemTypeEvan').value = type;
                    TimeTrackerApp.uiRenderer.showModal('deleteConfirmEvanModal');
                }
            });
        },
        
        // 初始化导出模态框 - Evan水印
        initExportModal() {
            // 打开导出模态框
            document.getElementById('exportDataEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.showModal('exportDataEvanModal');
            });
            
            // 关闭导出模态框
            document.getElementById('exportCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.hideModal('exportDataEvanModal');
            });
            
            // 导出所有数据为JSON
            document.getElementById('exportAllJsonEvanBtn').addEventListener('click', () => {
                const data = {
                    records: TimeTrackerApp.dataModel.records,
                    categories: TimeTrackerApp.dataModel.categories,
                    goals: TimeTrackerApp.dataModel.goals,
                    exportDate: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `time-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                TimeTrackerApp.uiRenderer.hideModal('exportDataEvanModal');
                TimeTrackerApp.uiRenderer.showNotification(
                    TimeTrackerApp.currentLang === 'zh' ? '数据已导出' : 'Data exported'
                );
            });
            
            // 导出今日记录为CSV
            document.getElementById('exportTodayCsvEvanBtn').addEventListener('click', () => {
                this.exportRecordsAsCsv('day');
            });
            
            // 导出本周记录为CSV
            document.getElementById('exportWeekCsvEvanBtn').addEventListener('click', () => {
                this.exportRecordsAsCsv('week');
            });
            
            // 导出类别分布为CSV
            document.getElementById('exportCategoryCsvEvanBtn').addEventListener('click', () => {
                const distribution = TimeTrackerApp.dataModel.calculateCategoryDistribution('month');
                let csv = TimeTrackerApp.currentLang === 'zh' ? '类别,时长(小时),百分比\n' : 'Category,Hours,Percentage\n';
                
                const total = Object.values(distribution).reduce((a, b) => a + b, 0);
                
                Object.keys(distribution).forEach(categoryId => {
                    const category = TimeTrackerApp.dataModel.getCategory(categoryId);
                    if (!category) return;
                    
                    const hours = distribution[categoryId];
                    const percentage = total > 0 ? Math.round((hours / total) * 100) : 0;
                    
                    csv += `"${category.name}",${hours.toFixed(1)},${percentage}%\n`;
                });
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `time-tracker-categories-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                
                TimeTrackerApp.uiRenderer.hideModal('exportDataEvanModal');
                TimeTrackerApp.uiRenderer.showNotification(
                    TimeTrackerApp.currentLang === 'zh' ? '类别分布已导出' : 'Category distribution exported'
                );
            });
        },
        
        // 导出记录为CSV - Evan水印
        exportRecordsAsCsv(range) {
            let startDate, endDate;
            const now = new Date(TimeTrackerApp.dataModel.currentDate);
            
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
                default:
                    startDate = new Date(now);
                    endDate = new Date(now);
            }
            
            const records = TimeTrackerApp.dataModel.getRecordsInDateRange(startDate, endDate);
            
            let csv = TimeTrackerApp.currentLang === 'zh' ? '日期,事项,类别,时长(小时),备注\n' : 'Date,Record,Category,Hours,Notes\n';
            
            records.forEach(record => {
                const category = TimeTrackerApp.dataModel.getCategory(record.categoryId);
                const categoryName = category ? category.name : '';
                const hours = (record.hours + record.minutes / 60).toFixed(1);
                const date = record.date.split('T')[0];
                
                csv += `"${date}","${record.name}","${categoryName}",${hours},"${record.notes || ''}"\n`;
            });
            
            const rangeText = range === 'day' ? TimeTrackerApp.currentLang === 'zh' ? '今日' : 'today' : TimeTrackerApp.currentLang === 'zh' ? '本周' : 'this-week';
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `time-tracker-records-${rangeText}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            
            TimeTrackerApp.uiRenderer.hideModal('exportDataEvanModal');
            TimeTrackerApp.uiRenderer.showNotification(
                TimeTrackerApp.currentLang === 'zh' ? `${range === 'day' ? '今日' : '本周'}记录已导出` : `${range === 'day' ? 'Today\'s' : 'This week\'s'} records exported`
            );
        },
        
        // 初始化删除确认模态框 - Evan水印
        initDeleteModal() {
            // 取消删除
            document.getElementById('deleteCancelEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.hideModal('deleteConfirmEvanModal');
            });
            
            // 确认删除
            document.getElementById('confirmDeleteEvanBtn').addEventListener('click', () => {
                const id = document.getElementById('deleteItemIdEvan').value;
                const type = document.getElementById('deleteItemTypeEvan').value;
                let success = false;
                let message = '';
                
                switch (type) {
                    case 'record':
                        success = TimeTrackerApp.dataModel.deleteRecord(id);
                        message = success 
                            ? (TimeTrackerApp.currentLang === 'zh' ? '记录已删除' : 'Record deleted')
                            : (TimeTrackerApp.currentLang === 'zh' ? '删除失败' : 'Deletion failed');
                        break;
                    case 'category':
                        const result = TimeTrackerApp.dataModel.deleteCategory(id);
                        success = result.success;
                        message = success 
                            ? (TimeTrackerApp.currentLang === 'zh' ? '类别已删除' : 'Category deleted')
                            : result.reason || (TimeTrackerApp.currentLang === 'zh' ? '删除失败' : 'Deletion failed');
                        break;
                    case 'goal':
                        success = TimeTrackerApp.dataModel.deleteGoal(id);
                        message = success 
                            ? (TimeTrackerApp.currentLang === 'zh' ? '目标已删除' : 'Goal deleted')
                            : (TimeTrackerApp.currentLang === 'zh' ? '删除失败' : 'Deletion failed');
                        break;
                }
                
                TimeTrackerApp.uiRenderer.hideModal('deleteConfirmEvanModal');
                TimeTrackerApp.uiRenderer.showNotification(message, success ? 'success' : 'error');
                
                if (success) {
                    if (type === 'record' || type === 'category') {
                        TimeTrackerApp.uiRenderer.renderRecords();
                        TimeTrackerApp.uiRenderer.updateTotalTime();
                        TimeTrackerApp.uiRenderer.renderCharts();
                    }
                    if (type === 'category' || type === 'goal') {
                        TimeTrackerApp.uiRenderer.renderCategories();
                        TimeTrackerApp.uiRenderer.populateCategorySelectors();
                    }
                    if (type === 'category' || type === 'goal') {
                        TimeTrackerApp.uiRenderer.renderGoals();
                    }
                }
            });
        },
        
        // 初始化范围按钮 - Evan水印
        initRangeButtons() {
            // 时间分布范围按钮
            document.querySelectorAll('.timeRangeBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.timeRangeBtnEvan').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    TimeTrackerApp.uiRenderer.renderTimeDistributionChart();
                });
            });
            
            // 趋势分析范围按钮
            document.querySelectorAll('.trendRangeBtnEvan').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.trendRangeBtnEvan').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    TimeTrackerApp.uiRenderer.renderTrendAnalysisChart();
                });
            });
        },
        
        // 初始化主题切换 - Evan水印
        initThemeToggle() {
            document.getElementById('themeToggleEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.toggleTheme();
            });
        },
        
        // 初始化语言切换 - Evan水印
        initLanguageToggle() {
            document.getElementById('langToggleEvanBtn').addEventListener('click', () => {
                TimeTrackerApp.uiRenderer.toggleLanguage();
            });
        }
    },
    
    // 初始化应用 - Evan水印
    init() {
        this.dataModel.init();
        this.uiRenderer.init();
        this.eventHandler.init();
    }
};

// 页面加载完成后初始化应用 - Evan水印
document.addEventListener('DOMContentLoaded', () => {
    TimeTrackerApp.init();
});