// 时间管理可视化看板 - JavaScript功能实现
// create by Evan

// 数据结构设计
let timeRecords = []; // 时间记录数据
let categories = []; // 类别数据
let goals = []; // 目标数据
let currentDate = new Date(); // 当前选中日期
let selectedRecordId = null; // 当前选中的记录ID（用于编辑或删除）
let timeDistributionChart = null; // 时间分配饼图
let trendAnalysisChart = null; // 趋势分析柱状图

// DOM元素
const elements = {
  // 日期选择
  prevDateBtn: document.getElementById('prev-date'),
  nextDateBtn: document.getElementById('next-date'),
  currentDateEl: document.getElementById('current-date'),
  
  // 添加记录
  addRecordBtn: document.getElementById('add-record-btn'),
  addRecordModal: document.getElementById('add-record-modal'),
  modalContent: document.getElementById('modal-content'),
  cancelRecordBtn: document.getElementById('cancel-record-btn'),
  saveRecordBtn: document.getElementById('save-record-btn'),
  
  // 记录表单
  recordName: document.getElementById('record-name'),
  recordCategory: document.getElementById('record-category'),
  recordHours: document.getElementById('record-hours'),
  recordMinutes: document.getElementById('record-minutes'),
  recordDate: document.getElementById('record-date'),
  recordNotes: document.getElementById('record-notes'),
  
  // 时间记录列表
  timeRecordsList: document.getElementById('time-records-list'),
  totalTimeEl: document.getElementById('total-time'),
  remainingTimeEl: document.getElementById('remaining-time'),
  
  // 类别管理
  categoriesList: document.getElementById('categories-list'),
  newCategoryName: document.getElementById('new-category-name'),
  newCategoryColor: document.getElementById('new-category-color'),
  addCategoryBtn: document.getElementById('add-category-btn'),
  
  // 时间分配图表
  timeDistributionChartEl: document.getElementById('time-distribution-chart'),
  categoryDistributionList: document.getElementById('category-distribution-list'),
  periodToggleBtns: document.querySelectorAll('.toggle-btn[data-period]'),
  
  // 趋势分析图表
  trendAnalysisChartEl: document.getElementById('trend-analysis-chart'),
  trendToggleBtns: document.querySelectorAll('.toggle-btn[data-trend]'),
  
  // 目标追踪
  goalsList: document.getElementById('goals-list'),
  addGoalBtn: document.getElementById('add-goal-btn'),
  addGoalModal: document.getElementById('add-goal-modal'),
  goalModalContent: document.getElementById('goal-modal-content'),
  cancelGoalBtn: document.getElementById('cancel-goal-btn'),
  saveGoalBtn: document.getElementById('save-goal-btn'),
  
  // 目标表单
  goalName: document.getElementById('goal-name'),
  goalCategory: document.getElementById('goal-category'),
  goalHours: document.getElementById('goal-hours'),
  goalMinutes: document.getElementById('goal-minutes'),
  
  // 确认删除
  confirmDeleteModal: document.getElementById('confirm-delete-modal'),
  deleteModalContent: document.getElementById('delete-modal-content'),
  cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
  confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
  
  // 成功提示
  successToast: document.getElementById('success-toast'),
  toastMessage: document.getElementById('toast-message'),
  
  // 主题切换
  themeToggle: document.getElementById('theme-toggle'),
  
  // 语言切换
  langZhBtn: document.getElementById('lang-zh'),
  langEnBtn: document.getElementById('lang-en')
};

// 初始化应用
function initApp() {
  // 初始化数据
  initializeData();
  
  // 初始化UI
  initializeUI();
  
  // 初始化事件监听
  initializeEventListeners();
  
  // 初始化图表
  initializeCharts();
  
  // 更新UI显示
  updateUI();
}

// 初始化数据
function initializeData() {
  try {
    // 从本地存储加载数据
    const savedRecords = localStorage.getItem('timeRecords');
    const savedCategories = localStorage.getItem('categories');
    const savedGoals = localStorage.getItem('goals');
    
    // 如果有保存的数据，则加载
    if (savedRecords) timeRecords = JSON.parse(savedRecords);
    if (savedGoals) goals = JSON.parse(savedGoals);
    
    // 如果没有类别数据，则初始化默认类别
    if (savedCategories) {
      categories = JSON.parse(savedCategories);
    } else {
      categories = [
        { id: generateId(), name: '工作', color: '#FF6B6B', icon: 'briefcase' },
        { id: generateId(), name: '健康', color: '#4ECDC4', icon: 'heartbeat' },
        { id: generateId(), name: '学习', color: '#45B7D1', icon: 'book' },
        { id: generateId(), name: '娱乐', color: '#FFA07A', icon: 'film' },
        { id: generateId(), name: '生活', color: '#98D8C8', icon: 'home' }
      ];
      saveCategories();
    }
    
    // 如果没有时间记录数据，则添加示例数据
    if (timeRecords.length === 0) {
      addSampleData();
    }
  } catch (e) {
    console.warn('初始化数据时出错:', e);
    // 初始化默认数据
    categories = [
      { id: generateId(), name: '工作', color: '#FF6B6B', icon: 'briefcase' },
      { id: generateId(), name: '健康', color: '#4ECDC4', icon: 'heartbeat' },
      { id: generateId(), name: '学习', color: '#45B7D1', icon: 'book' },
      { id: generateId(), name: '娱乐', color: '#FFA07A', icon: 'film' },
      { id: generateId(), name: '生活', color: '#98D8C8', icon: 'home' }
    ];
    addSampleData();
  }
}

// 添加示例数据
function addSampleData() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBeforeYesterday = new Date(yesterday);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);
  
  // 示例数据
  const sampleData = [
    // 今天的数据
    {
      id: generateId(),
      name: '项目开发',
      categoryId: categories.find(c => c.name === '工作').id,
      hours: 4,
      minutes: 30,
      date: formatDate(today),
      notes: '完成了首页设计和用户认证功能'
    },
    {
      id: generateId(),
      name: '健身',
      categoryId: categories.find(c => c.name === '健康').id,
      hours: 1,
      minutes: 0,
      date: formatDate(today),
      notes: '进行了力量训练和有氧运动'
    },
    {
      id: generateId(),
      name: '阅读技术书籍',
      categoryId: categories.find(c => c.name === '学习').id,
      hours: 1,
      minutes: 30,
      date: formatDate(today),
      notes: '阅读了关于前端性能优化的章节'
    },
    
    // 昨天的数据
    {
      id: generateId(),
      name: '团队会议',
      categoryId: categories.find(c => c.name === '工作').id,
      hours: 2,
      minutes: 0,
      date: formatDate(yesterday),
      notes: '讨论了本周工作计划和项目进度'
    },
    {
      id: generateId(),
      name: '跑步',
      categoryId: categories.find(c => c.name === '健康').id,
      hours: 0,
      minutes: 45,
      date: formatDate(yesterday),
      notes: '在公园慢跑45分钟'
    },
    {
      id: generateId(),
      name: '观看电影',
      categoryId: categories.find(c => c.name === '娱乐').id,
      hours: 2,
      minutes: 15,
      date: formatDate(yesterday),
      notes: '观看了一部科幻电影'
    },
    
    // 前天的数据
    {
      id: generateId(),
      name: '编写文档',
      categoryId: categories.find(c => c.name === '工作').id,
      hours: 3,
      minutes: 0,
      date: formatDate(dayBeforeYesterday),
      notes: '完成了项目需求文档和API文档'
    },
    {
      id: generateId(),
      name: '学习React',
      categoryId: categories.find(c => c.name === '学习').id,
      hours: 2,
      minutes: 0,
      date: formatDate(dayBeforeYesterday),
      notes: '学习了React Hooks和状态管理'
    },
    {
      id: generateId(),
      name: '购物',
      categoryId: categories.find(c => c.name === '生活').id,
      hours: 1,
      minutes: 30,
      date: formatDate(dayBeforeYesterday),
      notes: '购买了生活用品和食材'
    }
  ];
  
  // 添加示例数据
  timeRecords = sampleData;
  saveTimeRecords();
  
  // 添加示例目标
  if (goals.length === 0) {
    goals = [
      {
        id: generateId(),
        name: '工作时间',
        categoryId: categories.find(c => c.name === '工作').id,
        hours: 8,
        minutes: 0
      },
      {
        id: generateId(),
        name: '学习时间',
        categoryId: categories.find(c => c.name === '学习').id,
        hours: 2,
        minutes: 0
      },
      {
        id: generateId(),
        name: '健身时间',
        categoryId: categories.find(c => c.name === '健康').id,
        hours: 1,
        minutes: 0
      }
    ];
    saveGoals();
  }
}

// 初始化UI
function initializeUI() {
  // 设置当前日期显示
  updateCurrentDateDisplay();
  
  // 填充时间选择下拉框
  populateTimeSelectors();
  
  // 设置记录日期为当前选中日期
  elements.recordDate.value = formatDateForInput(currentDate);
  
  // 填充类别下拉框
  populateCategorySelectors();
}

// 更新当前日期显示
function updateCurrentDateDisplay() {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  elements.currentDateEl.textContent = currentDate.toLocaleDateString('zh-CN', options);
}

// 填充时间选择下拉框
function populateTimeSelectors() {
  // 填充小时选择
  for (let i = 0; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    elements.recordHours.appendChild(option.cloneNode(true));
    elements.goalHours.appendChild(option);
  }
  
  // 填充分钟选择（间隔5分钟）
  for (let i = 0; i < 60; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    elements.recordMinutes.appendChild(option.cloneNode(true));
    elements.goalMinutes.appendChild(option);
  }
}

// 填充类别下拉框
function populateCategorySelectors() {
  // 清空现有选项
  elements.recordCategory.innerHTML = '';
  elements.goalCategory.innerHTML = '';
  
  // 添加类别选项
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    option.style.color = category.color;
    
    elements.recordCategory.appendChild(option.cloneNode(true));
    elements.goalCategory.appendChild(option);
  });
}

// 初始化事件监听
function initializeEventListeners() {
  // 日期选择
  elements.prevDateBtn.addEventListener('click', () => navigateDate(-1));
  elements.nextDateBtn.addEventListener('click', () => navigateDate(1));
  
  // 添加记录
  elements.addRecordBtn.addEventListener('click', openAddRecordModal);
  elements.cancelRecordBtn.addEventListener('click', closeAddRecordModal);
  elements.saveRecordBtn.addEventListener('click', saveRecord);
  
  // 添加类别
  elements.addCategoryBtn.addEventListener('click', addCategory);
  
  // 时间分配图表切换
  elements.periodToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.periodToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateTimeDistributionChart(btn.dataset.period);
    });
  });
  
  // 趋势分析图表切换
  elements.trendToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.trendToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateTrendAnalysisChart(btn.dataset.trend);
    });
  });
  
  // 目标管理
  elements.addGoalBtn.addEventListener('click', openAddGoalModal);
  elements.cancelGoalBtn.addEventListener('click', closeAddGoalModal);
  elements.saveGoalBtn.addEventListener('click', saveGoal);
  
  // 确认删除
  elements.cancelDeleteBtn.addEventListener('click', closeConfirmDeleteModal);
  elements.confirmDeleteBtn.addEventListener('click', confirmDeleteRecord);
  
  // 主题切换
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // 语言切换
  elements.langZhBtn.addEventListener('click', () => setLanguage('zh'));
  elements.langEnBtn.addEventListener('click', () => setLanguage('en'));
}

// 导航日期
function navigateDate(days) {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + days);
  currentDate = newDate;
  updateCurrentDateDisplay();
  elements.recordDate.value = formatDateForInput(currentDate);
  updateUI();
}

// 打开添加记录模态框
function openAddRecordModal() {
  // 重置表单
  elements.recordName.value = '';
  elements.recordHours.value = '0';
  elements.recordMinutes.value = '0';
  elements.recordNotes.value = '';
  selectedRecordId = null;
  
  // 显示模态框
  elements.addRecordModal.classList.remove('hidden');
  setTimeout(() => {
    elements.modalContent.classList.remove('scale-95', 'opacity-0');
    elements.modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  // 聚焦到第一个输入框
  elements.recordName.focus();
}

// 关闭添加记录模态框
function closeAddRecordModal() {
  elements.modalContent.classList.remove('scale-100', 'opacity-100');
  elements.modalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    elements.addRecordModal.classList.add('hidden');
  }, 300);
}

// 保存记录
function saveRecord() {
  // 获取表单数据
  const name = elements.recordName.value.trim();
  const categoryId = elements.recordCategory.value;
  const hours = parseInt(elements.recordHours.value);
  const minutes = parseInt(elements.recordMinutes.value);
  const date = elements.recordDate.value;
  const notes = elements.recordNotes.value.trim();
  
  // 验证表单
  if (!name) {
    alert('请输入事项名称');
    return;
  }
  
  if (hours === 0 && minutes === 0) {
    alert('请设置时长');
    return;
  }
  
  // 计算当前日期的总时长
  const currentDateRecords = getRecordsByDate(date);
  const currentTotalMinutes = currentDateRecords.reduce((total, record) => {
    // 排除当前正在编辑的记录
    if (selectedRecordId && record.id === selectedRecordId) {
      return total;
    }
    return total + (record.hours * 60 + record.minutes);
  }, 0);
  
  // 检查总时长是否超过18小时
  const newRecordMinutes = hours * 60 + minutes;
  if (currentTotalMinutes + newRecordMinutes > 18 * 60) {
    alert('每天总时长不能超过18小时');
    return;
  }
  
  if (selectedRecordId) {
    // 编辑现有记录
    const recordIndex = timeRecords.findIndex(record => record.id === selectedRecordId);
    if (recordIndex !== -1) {
      timeRecords[recordIndex] = {
        ...timeRecords[recordIndex],
        name,
        categoryId,
        hours,
        minutes,
        date,
        notes
      };
      showToast('记录已更新');
    }
  } else {
    // 添加新记录
    const newRecord = {
      id: generateId(),
      name,
      categoryId,
      hours,
      minutes,
      date,
      notes
    };
    
    timeRecords.push(newRecord);
    showToast('记录已添加');
  }
  
  // 保存数据
  saveTimeRecords();
  
  // 关闭模态框
  closeAddRecordModal();
  
  // 更新UI
  updateUI();
}

// 打开编辑记录模态框
function openEditRecordModal(recordId) {
  const record = timeRecords.find(r => r.id === recordId);
  if (!record) return;
  
  // 填充表单
  elements.recordName.value = record.name;
  elements.recordCategory.value = record.categoryId;
  elements.recordHours.value = record.hours;
  elements.recordMinutes.value = record.minutes;
  elements.recordDate.value = record.date;
  elements.recordNotes.value = record.notes || '';
  selectedRecordId = record.id;
  
  // 显示模态框
  elements.addRecordModal.classList.remove('hidden');
  setTimeout(() => {
    elements.modalContent.classList.remove('scale-95', 'opacity-0');
    elements.modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  // 聚焦到第一个输入框
  elements.recordName.focus();
}

// 打开确认删除模态框
function openConfirmDeleteModal(recordId) {
  selectedRecordId = recordId;
  
  // 显示模态框
  elements.confirmDeleteModal.classList.remove('hidden');
  setTimeout(() => {
    elements.deleteModalContent.classList.remove('scale-95', 'opacity-0');
    elements.deleteModalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

// 关闭确认删除模态框
function closeConfirmDeleteModal() {
  elements.deleteModalContent.classList.remove('scale-100', 'opacity-100');
  elements.deleteModalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    elements.confirmDeleteModal.classList.add('hidden');
  }, 300);
}

// 确认删除记录
function confirmDeleteRecord() {
  if (!selectedRecordId) return;
  
  // 删除记录
  timeRecords = timeRecords.filter(record => record.id !== selectedRecordId);
  
  // 保存数据
  saveTimeRecords();
  
  // 关闭模态框
  closeConfirmDeleteModal();
  
  // 显示提示
  showToast('记录已删除');
  
  // 更新UI
  updateUI();
}

// 添加类别
function addCategory() {
  const name = elements.newCategoryName.value.trim();
  const color = elements.newCategoryColor.value;
  
  if (!name) {
    alert('请输入类别名称');
    return;
  }
  
  // 检查类别是否已存在
  if (categories.some(c => c.name === name)) {
    alert('该类别已存在');
    return;
  }
  
  // 创建新类别
  const newCategory = {
    id: generateId(),
    name,
    color,
    icon: 'tag' // 默认图标
  };
  
  categories.push(newCategory);
  
  // 保存数据
  saveCategories();
  
  // 重置表单
  elements.newCategoryName.value = '';
  
  // 更新UI
  populateCategorySelectors();
  renderCategories();
  updateTimeDistributionChart(document.querySelector('.toggle-btn[data-period].active').dataset.period);
  updateTrendAnalysisChart(document.querySelector('.toggle-btn[data-trend].active').dataset.trend);
  renderGoals();
  
  // 显示提示
  showToast('类别已添加');
}

// 删除类别
function deleteCategory(categoryId) {
  // 检查是否有记录使用该类别
  const hasRecords = timeRecords.some(record => record.categoryId === categoryId);
  if (hasRecords) {
    alert('无法删除正在使用的类别');
    return;
  }
  
  // 检查是否有目标使用该类别
  const hasGoals = goals.some(goal => goal.categoryId === categoryId);
  if (hasGoals) {
    alert('无法删除正在使用的类别');
    return;
  }
  
  // 删除类别
  categories = categories.filter(category => category.id !== categoryId);
  
  // 保存数据
  saveCategories();
  
  // 更新UI
  populateCategorySelectors();
  renderCategories();
  updateTimeDistributionChart(document.querySelector('.toggle-btn[data-period].active').dataset.period);
  updateTrendAnalysisChart(document.querySelector('.toggle-btn[data-trend].active').dataset.trend);
  renderGoals();
  
  // 显示提示
  showToast('类别已删除');
}

// 打开添加目标模态框
function openAddGoalModal() {
  // 重置表单
  elements.goalName.value = '';
  elements.goalCategory.value = categories[0]?.id || '';
  elements.goalHours.value = '1';
  elements.goalMinutes.value = '0';
  
  // 显示模态框
  elements.addGoalModal.classList.remove('hidden');
  setTimeout(() => {
    elements.goalModalContent.classList.remove('scale-95', 'opacity-0');
    elements.goalModalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  // 聚焦到第一个输入框
  elements.goalName.focus();
}

// 关闭添加目标模态框
function closeAddGoalModal() {
  elements.goalModalContent.classList.remove('scale-100', 'opacity-100');
  elements.goalModalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    elements.addGoalModal.classList.add('hidden');
  }, 300);
}

// 保存目标
function saveGoal() {
  // 获取表单数据
  const name = elements.goalName.value.trim();
  const categoryId = elements.goalCategory.value;
  const hours = parseInt(elements.goalHours.value);
  const minutes = parseInt(elements.goalMinutes.value);
  
  // 验证表单
  if (!name) {
    alert('请输入目标名称');
    return;
  }
  
  if (hours === 0 && minutes === 0) {
    alert('请设置目标时长');
    return;
  }
  
  // 添加新目标
  const newGoal = {
    id: generateId(),
    name,
    categoryId,
    hours,
    minutes
  };
  
  goals.push(newGoal);
  
  // 保存数据
  saveGoals();
  
  // 关闭模态框
  closeAddGoalModal();
  
  // 更新UI
  renderGoals();
  
  // 显示提示
  showToast('目标已添加');
}

// 删除目标
function deleteGoal(goalId) {
  // 删除目标
  goals = goals.filter(goal => goal.id !== goalId);
  
  // 保存数据
  saveGoals();
  
  // 更新UI
  renderGoals();
  
  // 显示提示
  showToast('目标已删除');
}

// 初始化图表
function initializeCharts() {
  // 初始化时间分配饼图
  const timeDistributionCtx = elements.timeDistributionChartEl.getContext('2d');
  timeDistributionChart = new Chart(timeDistributionCtx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderWidth: 2,
        borderColor: '#ffffff'
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
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatTimeFromMinutes(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
  
  // 初始化趋势分析柱状图
  const trendAnalysisCtx = elements.trendAnalysisChartEl.getContext('2d');
  trendAnalysisChart = new Chart(trendAnalysisCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatTimeFromMinutes(value);
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${formatTimeFromMinutes(value)}`;
            }
          }
        }
      }
    }
  });
  
  // 更新图表数据
  updateTimeDistributionChart('day');
  updateTrendAnalysisChart('week');
}

// 更新时间分配图表
function updateTimeDistributionChart(period) {
  let records = [];
  let title = '';
  
  switch (period) {
    case 'day':
      records = getRecordsByDate(formatDate(currentDate));
      title = '今日时间分配';
      break;
    case 'week':
      records = getRecordsByWeek(currentDate);
      title = '本周时间分配';
      break;
    case 'month':
      records = getRecordsByMonth(currentDate);
      title = '本月时间分配';
      break;
  }
  
  // 按类别分组计算时间
  const categoryTime = {};
  records.forEach(record => {
    const minutes = record.hours * 60 + record.minutes;
    if (categoryTime[record.categoryId]) {
      categoryTime[record.categoryId] += minutes;
    } else {
      categoryTime[record.categoryId] = minutes;
    }
  });
  
  // 准备图表数据
  const labels = [];
  const data = [];
  const backgroundColor = [];
  
  Object.keys(categoryTime).forEach(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      labels.push(category.name);
      data.push(categoryTime[categoryId]);
      backgroundColor.push(category.color);
    }
  });
  
  // 更新图表
  timeDistributionChart.data.labels = labels;
  timeDistributionChart.data.datasets[0].data = data;
  timeDistributionChart.data.datasets[0].backgroundColor = backgroundColor;
  timeDistributionChart.update();
  
  // 更新类别分布列表
  renderCategoryDistribution(categoryTime);
}

// 渲染类别分布列表
function renderCategoryDistribution(categoryTime) {
  elements.categoryDistributionList.innerHTML = '';
  
  // 计算总时间
  const totalTime = Object.values(categoryTime).reduce((total, time) => total + time, 0);
  
  // 按时间排序
  const sortedCategories = Object.keys(categoryTime).sort((a, b) => categoryTime[b] - categoryTime[a]);
  
  // 创建列表项
  sortedCategories.forEach(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const time = categoryTime[categoryId];
    const percentage = totalTime > 0 ? Math.round((time / totalTime) * 100) : 0;
    
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between mb-2';
    item.innerHTML = `
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${category.color}"></div>
        <span class="text-sm font-medium">${category.name}</span>
      </div>
      <div class="flex items-center">
        <span class="text-sm mr-2">${percentage}%</span>
        <div class="progress-bar w-24">
          <div class="progress-value" style="width: ${percentage}%; background-color: ${category.color}"></div>
        </div>
      </div>
    `;
    
    elements.categoryDistributionList.appendChild(item);
  });
}

// 更新趋势分析图表
function updateTrendAnalysisChart(period) {
  let records = [];
  let labels = [];
  let days = [];
  
  switch (period) {
    case 'week':
      // 获取本周的所有日期
      days = getDaysOfWeek(currentDate);
      labels = days.map(day => day.toLocaleDateString('zh-CN', { weekday: 'short' }));
      records = getRecordsByWeek(currentDate);
      break;
    case 'month':
      // 获取本月的所有日期
      days = getDaysOfMonth(currentDate);
      labels = days.map(day => day.getDate() + '日');
      records = getRecordsByMonth(currentDate);
      break;
    case 'all':
      // 获取所有记录的日期
      const allDates = [...new Set(timeRecords.map(record => record.date))].sort();
      days = allDates.map(dateStr => new Date(dateStr));
      labels = days.map(day => day.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
      records = timeRecords;
      break;
  }
  
  // 按日期和类别分组计算时间
  const dateCategoryTime = {};
  days.forEach(day => {
    const dateStr = formatDate(day);
    dateCategoryTime[dateStr] = {};
    categories.forEach(category => {
      dateCategoryTime[dateStr][category.id] = 0;
    });
  });
  
  records.forEach(record => {
    if (dateCategoryTime[record.date]) {
      const minutes = record.hours * 60 + record.minutes;
      if (dateCategoryTime[record.date][record.categoryId] !== undefined) {
        dateCategoryTime[record.date][record.categoryId] += minutes;
      } else {
        dateCategoryTime[record.date][record.categoryId] = minutes;
      }
    }
  });
  
  // 准备图表数据
  const datasets = categories.map(category => {
    return {
      label: category.name,
      data: days.map(day => dateCategoryTime[formatDate(day)][category.id]),
      backgroundColor: category.color,
      borderColor: category.color,
      borderWidth: 1
    };
  });
  
  // 更新图表
  trendAnalysisChart.data.labels = labels;
  trendAnalysisChart.data.datasets = datasets;
  trendAnalysisChart.update();
}

// 更新UI
function updateUI() {
  // 渲染时间记录列表
  renderTimeRecords();
  
  // 渲染类别列表
  renderCategories();
  
  // 渲染目标列表
  renderGoals();
  
  // 更新时间分配图表
  updateTimeDistributionChart(document.querySelector('.toggle-btn[data-period].active').dataset.period);
  
  // 更新趋势分析图表
  updateTrendAnalysisChart(document.querySelector('.toggle-btn[data-trend].active').dataset.trend);
}

// 渲染时间记录列表
function renderTimeRecords() {
  const dateStr = formatDate(currentDate);
  const records = getRecordsByDate(dateStr);
  
  elements.timeRecordsList.innerHTML = '';
  
  if (records.length === 0) {
    const emptyItem = document.createElement('div');
    emptyItem.className = 'text-center py-8 text-gray-500';
    emptyItem.innerHTML = `
      <i class="fa fa-calendar-o text-3xl mb-2"></i>
      <p>今天还没有记录</p>
      <p class="text-sm">点击"添加时间记录"开始记录你的时间</p>
    `;
    elements.timeRecordsList.appendChild(emptyItem);
  } else {
    // 按时间排序（降序）
    records.sort((a, b) => {
      return (b.hours * 60 + b.minutes) - (a.hours * 60 + a.minutes);
    });
    
    // 创建记录项
    records.forEach(record => {
      const category = categories.find(c => c.id === record.categoryId);
      if (!category) return;
      
      const item = document.createElement('div');
      item.className = 'time-record-item flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300';
      item.innerHTML = `
        <div class="flex items-center flex-1">
          <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" style="background-color: ${category.color}20; color: ${category.color}">
            <i class="fa fa-${category.icon}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-800 truncate">${record.name}</h4>
            <div class="flex items-center mt-1">
              <span class="category-badge mr-2" style="background-color: ${category.color}20; color: ${category.color}">
                ${category.name}
              </span>
              <span class="text-sm text-gray-500">${formatTime(record.hours, record.minutes)}</span>
            </div>
            ${record.notes ? `<p class="text-xs text-gray-500 mt-1 truncate">${record.notes}</p>` : ''}
          </div>
        </div>
        <div class="actions flex items-center space-x-2 opacity-0">
          <button class="edit-record-btn p-2 rounded-full hover:bg-gray-100 transition-colors duration-300" data-id="${record.id}">
            <i class="fa fa-pencil text-gray-600"></i>
          </button>
          <button class="delete-record-btn p-2 rounded-full hover:bg-gray-100 transition-colors duration-300" data-id="${record.id}">
            <i class="fa fa-trash text-gray-600"></i>
          </button>
        </div>
      `;
      
      elements.timeRecordsList.appendChild(item);
      
      // 添加事件监听
      item.querySelector('.edit-record-btn').addEventListener('click', () => {
        openEditRecordModal(record.id);
      });
      
      item.querySelector('.delete-record-btn').addEventListener('click', () => {
        openConfirmDeleteModal(record.id);
      });
    });
  }
  
  // 更新总计时间和剩余时间
  updateTotalAndRemainingTime(records);
}

// 更新总计时间和剩余时间
function updateTotalAndRemainingTime(records) {
  // 计算总计时间
  const totalMinutes = records.reduce((total, record) => {
    return total + (record.hours * 60 + record.minutes);
  }, 0);
  
  // 计算剩余时间（假设一天清醒时间为18小时）
  const remainingMinutes = Math.max(0, 18 * 60 - totalMinutes);
  
  // 更新显示
  elements.totalTimeEl.textContent = formatTimeFromMinutes(totalMinutes);
  elements.remainingTimeEl.textContent = formatTimeFromMinutes(remainingMinutes);
}

// 渲染类别列表
function renderCategories() {
  elements.categoriesList.innerHTML = '';
  
  categories.forEach(category => {
    const item = document.createElement('div');
    item.className = 'category-item flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300';
    item.innerHTML = `
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: ${category.color}20; color: ${category.color}">
          <i class="fa fa-${category.icon}"></i>
        </div>
        <span class="font-medium">${category.name}</span>
      </div>
      <button class="delete-category-btn p-2 rounded-full hover:bg-gray-100 transition-colors duration-300" data-id="${category.id}">
        <i class="fa fa-trash text-gray-600"></i>
      </button>
    `;
    
    elements.categoriesList.appendChild(item);
    
    // 添加事件监听
    item.querySelector('.delete-category-btn').addEventListener('click', () => {
      deleteCategory(category.id);
    });
  });
}

// 渲染目标列表
function renderGoals() {
  elements.goalsList.innerHTML = '';
  
  if (goals.length === 0) {
    const emptyItem = document.createElement('div');
    emptyItem.className = 'text-center py-8 text-gray-500';
    emptyItem.innerHTML = `
      <i class="fa fa-bullseye-o text-3xl mb-2"></i>
      <p>还没有设置目标</p>
      <p class="text-sm">点击"添加目标"开始设置你的每日目标</p>
    `;
    elements.goalsList.appendChild(emptyItem);
  } else {
    // 获取今天的记录
    const todayRecords = getRecordsByDate(formatDate(currentDate));
    
    // 按类别分组计算今天的时间
    const todayCategoryTime = {};
    todayRecords.forEach(record => {
      const minutes = record.hours * 60 + record.minutes;
      if (todayCategoryTime[record.categoryId]) {
        todayCategoryTime[record.categoryId] += minutes;
      } else {
        todayCategoryTime[record.categoryId] = minutes;
      }
    });
    
    // 创建目标项
    goals.forEach(goal => {
      const category = categories.find(c => c.id === goal.categoryId);
      if (!category) return;
      
      const goalMinutes = goal.hours * 60 + goal.minutes;
      const todayMinutes = todayCategoryTime[goal.categoryId] || 0;
      const percentage = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
      
      const item = document.createElement('div');
      item.className = 'goal-item p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300';
      item.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: ${category.color}20; color: ${category.color}">
              <i class="fa fa-${category.icon}"></i>
            </div>
            <h4 class="font-medium">${goal.name}</h4>
          </div>
          <div class="flex items-center">
            <span class="text-sm font-medium mr-2">${percentage}%</span>
            <button class="delete-goal-btn p-1 rounded-full hover:bg-gray-100 transition-colors duration-300" data-id="${goal.id}">
              <i class="fa fa-trash text-gray-600"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>今日进度</span>
          <span>${formatTimeFromMinutes(todayMinutes)} / ${formatTime(goal.hours, goal.minutes)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: ${percentage}%; background-color: ${category.color}"></div>
        </div>
      `;
      
      elements.goalsList.appendChild(item);
      
      // 添加事件监听
      item.querySelector('.delete-goal-btn').addEventListener('click', () => {
        deleteGoal(goal.id);
      });
    });
  }
}

// 显示提示
function showToast(message) {
  elements.toastMessage.textContent = message;
  elements.successToast.classList.add('show');
  
  setTimeout(() => {
    elements.successToast.classList.remove('show');
  }, 3000);
}

// 切换主题
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  
  // 更新图标
  const icon = elements.themeToggle.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.remove('fa-moon-o');
    icon.classList.add('fa-sun-o');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.remove('fa-sun-o');
    icon.classList.add('fa-moon-o');
    localStorage.setItem('theme', 'light');
  }
}

// 设置语言
function setLanguage(lang) {
  // 这里只是一个示例，实际应用中可以根据语言切换文本内容
  if (lang === 'zh') {
    elements.langZhBtn.classList.add('bg-primary', 'text-white');
    elements.langZhBtn.classList.remove('text-gray-700', 'hover:bg-gray-200');
    elements.langEnBtn.classList.remove('bg-primary', 'text-white');
    elements.langEnBtn.classList.add('text-gray-700', 'hover:bg-gray-200');
  } else {
    elements.langEnBtn.classList.add('bg-primary', 'text-white');
    elements.langEnBtn.classList.remove('text-gray-700', 'hover:bg-gray-200');
    elements.langZhBtn.classList.remove('bg-primary', 'text-white');
    elements.langZhBtn.classList.add('text-gray-700', 'hover:bg-gray-200');
  }
  
  localStorage.setItem('language', lang);
}

// 工具函数：生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 工具函数：格式化日期为YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 工具函数：格式化日期为YYYY-MM-DD（用于输入框）
function formatDateForInput(date) {
  return formatDate(date);
}

// 工具函数：格式化时间
function formatTime(hours, minutes) {
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}分钟`);
  }
  return parts.join('');
}

// 工具函数：从分钟格式化时间
function formatTimeFromMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return formatTime(hours, minutes);
}

// 工具函数：根据日期获取记录
function getRecordsByDate(dateStr) {
  return timeRecords.filter(record => record.date === dateStr);
}

// 工具函数：根据周获取记录
function getRecordsByWeek(date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  const weekStartStr = formatDate(weekStart);
  const weekEndStr = formatDate(weekEnd);
  
  return timeRecords.filter(record => {
    return record.date >= weekStartStr && record.date <= weekEndStr;
  });
}

// 工具函数：根据月获取记录
function getRecordsByMonth(date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  const monthStartStr = formatDate(monthStart);
  const monthEndStr = formatDate(monthEnd);
  
  return timeRecords.filter(record => {
    return record.date >= monthStartStr && record.date <= monthEndStr;
  });
}

// 工具函数：获取一周的所有日期
function getDaysOfWeek(date) {
  const days = [];
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  
  return days;
}

// 工具函数：获取一个月的所有日期
function getDaysOfMonth(date) {
  const days = [];
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  for (let i = 0; i < monthEnd.getDate(); i++) {
    const day = new Date(monthStart);
    day.setDate(monthStart.getDate() + i);
    days.push(day);
  }
  
  return days;
}

// 保存时间记录到本地存储
function saveTimeRecords() {
  try {
    localStorage.setItem('timeRecords', JSON.stringify(timeRecords));
  } catch (e) {
    console.warn('无法保存数据到本地存储:', e);
    // 可以在这里添加降级处理，比如使用cookie或者仅在内存中存储
  }
}

// 保存类别到本地存储
function saveCategories() {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (e) {
    console.warn('无法保存数据到本地存储:', e);
    // 可以在这里添加降级处理，比如使用cookie或者仅在内存中存储
  }
}

// 保存目标到本地存储
function saveGoals() {
  try {
    localStorage.setItem('goals', JSON.stringify(goals));
  } catch (e) {
    console.warn('无法保存数据到本地存储:', e);
    // 可以在这里添加降级处理，比如使用cookie或者仅在内存中存储
  }
}

// 加载保存的主题
function loadSavedTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      const icon = elements.themeToggle.querySelector('i');
      icon.classList.remove('fa-moon-o');
      icon.classList.add('fa-sun-o');
    }
  } catch (e) {
    console.warn('无法从本地存储加载主题:', e);
  }
}

// 加载保存的语言
function loadSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem('language') || 'zh';
    setLanguage(savedLanguage);
  } catch (e) {
    console.warn('无法从本地存储加载语言:', e);
    setLanguage('zh'); // 默认使用中文
  }
}

// 应用加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  loadSavedTheme();
  loadSavedLanguage();
});
