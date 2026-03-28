/* 学习数据统计 - JavaScript */

var d;

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    render();
    document.getElementById('goalStartDate').value = d.startDate;
    document.getElementById('goalDays').value = d.goalDaysPerWeek;
    document.getElementById('goalHours').value = d.goalHours;
});

function getDefaultData() {
    return {
        startDate: new Date().toISOString().split('T')[0],
        goalHours: 100,
        goalDaysPerWeek: 5,
        chapters: [
            { name: 'Python基础', icon: '🐍', done: false, barClass: 'bar-purple' },
            { name: 'AI基本概念', icon: '🤖', done: false, barClass: 'bar-green' },
            { name: 'LLM API调用', icon: '🔗', done: false, barClass: 'bar-orange' },
            { name: 'Agent核心原理', icon: '⚙️', done: false, barClass: 'bar-blue' },
            { name: 'Agent框架实战', icon: '🛠️', done: false, barClass: 'bar-purple' },
            { name: '项目实战', icon: '🚀', done: false, barClass: 'bar-green' },
        ],
        skills: [
            { name: 'Python编程', pct: 0, color: '#6c63ff' },
            { name: 'Prompt工程', pct: 0, color: '#a855f7' },
            { name: 'API调用', pct: 0, color: '#10b981' },
            { name: 'Agent开发', pct: 0, color: '#f59e0b' },
            { name: '框架使用', pct: 0, color: '#3b82f6' },
            { name: '项目实战', pct: 0, color: '#ef4444' },
        ],
        quizScores: [],
        activities: [],
        dailyMinutes: {},
    };
}

function loadData() {
    var raw = localStorage.getItem('ai_learning_stats');
    if (!raw) { d = getDefaultData(); saveData(); }
    else { d = JSON.parse(raw); }
    window._d = d;
}

function saveData() {
    localStorage.setItem('ai_learning_stats', JSON.stringify(d));
}

function addActivity(text) {
    var now = new Date();
    var time = now.toLocaleDateString('zh-CN', {month:'short',day:'numeric'}) + ' ' + now.toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit'});
    d.activities.unshift({ text: text, time: time });
    if (d.activities.length > 20) d.activities = d.activities.slice(0, 20);
    saveData();
}

function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 2500);
}

function render() {
    var today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric'});

    // 学习天数
    var start = new Date(d.startDate);
    var daysSinceStart = Math.max(1, Math.ceil((today - start) / 86400000));
    document.getElementById('statDays').textContent = daysSinceStart;

    // 连续学习
    var weekDays = getLast7Days(today);
    var studyDaysThisWeek = weekDays.filter(function(day) { return (d.dailyMinutes[day] || 0) > 0; }).length;
    document.getElementById('streakText').textContent = '本周已学 ' + studyDaysThisWeek + ' 天';

    // 总时长
    var totalMins = 0;
    Object.keys(d.dailyMinutes).forEach(function(k) { totalMins += d.dailyMinutes[k] || 0; });
    var totalH = Math.round(totalMins / 60 * 10) / 10;
    document.getElementById('statHours').textContent = totalH;
    document.getElementById('hoursGoal').textContent = '目标: ' + d.goalHours + 'h';

    // 章节
    var completed = d.chapters.filter(function(c) { return c.done; }).length;
    document.getElementById('statCompleted').textContent = completed + '/6';
    document.getElementById('chapterGoal').textContent = '章节 ' + completed + '/6';

    // 测验
    var scores = d.quizScores.map(function(q) { return q.score; });
    var avg = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0) / scores.length) : 0;
    var best = scores.length ? Math.max.apply(Math, scores) : 0;
    document.getElementById('statQuiz').textContent = avg + '%';
    document.getElementById('quizBest').textContent = '最高: ' + best + '%';

    renderCircular(avg, completed, totalH);
    renderChapterProgress();
    renderCalendar(today);
    renderWeeklyChart(today);
    renderQuizHistory();
    renderActivities();
    renderSkills();
    renderBadges(completed, totalH, avg);
}

function getLast7Days(today) {
    var days = [];
    for (var i = 6; i >= 0; i--) {
        var d2 = new Date(today);
        d2.setDate(today.getDate() - i);
        days.push(d2.toISOString().split('T')[0]);
    }
    return days;
}

function renderCircular(quizAvg, completed, hours) {
    var circumference = 2 * Math.PI * 52;
    var circumference2 = 2 * Math.PI * 38;
    var overallPct = Math.round((completed / 6) * 100);
    var quizPct = quizAvg;

    var circ1 = document.getElementById('circOverall');
    if (circ1) {
        circ1.style.strokeDasharray = circumference;
        circ1.style.strokeDashoffset = circumference * (1 - overallPct / 100);
    }
    var label1 = document.getElementById('circLabelOverall');
    if (label1) label1.textContent = overallPct + '%';

    var circ2 = document.getElementById('circChapter');
    if (circ2) {
        circ2.style.strokeDasharray = circumference2;
        circ2.style.strokeDashoffset = circumference2 * (1 - completed / 6);
    }
    var label2 = document.getElementById('circLabelChapter');
    if (label2) label2.textContent = completed + '/6';

    var circ3 = document.getElementById('circQuiz');
    if (circ3) {
        circ3.style.strokeDasharray = circumference2;
        circ3.style.strokeDashoffset = circumference2 * (1 - quizAvg / 100);
    }
    var label3 = document.getElementById('circLabelQuiz');
    if (label3) label3.textContent = quizAvg + '%';
}

function renderChapterProgress() {
    var container = document.getElementById('chapterProgressList');
    if (!container) return;
    var html = '';
    d.chapters.forEach(function(ch, i) {
        var pct = ch.done ? 100 : 0;
        var barColor = ['#6c63ff','#10b981','#f59e0b','#3b82f6','#6c63ff','#10b981'][i];
        html += '<div class="chapter-progress-item">';
        html += '<span class="chapter-icon">' + ch.icon + '</span>';
        html += '<div class="chapter-info">';
        html += '<div class="chapter-name">' + ch.name + (ch.done ? ' ✅' : '') + '</div>';
        html += '<div class="chapter-bar-wrap">';
        html += '<div class="chapter-bar ' + ch.barClass + '" style="width:' + pct + '%"></div>';
        html += '</div></div>';
        html += '<span class="chapter-pct">' + pct + '%</span>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function renderCalendar(today) {
    var container = document.getElementById('calGrid');
    if (!container) return;
    var year = today.getFullYear();
    var month = today.getMonth();
    var firstDay = new Date(year, month, 1);
    var startDow = (firstDay.getDay() + 6) % 7; // 周一=0
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var todayStr = today.toISOString().split('T')[0];

    var html = '';
    for (var i = 0; i < startDow; i++) {
        html += '<div class="cal-day empty"></div>';
    }
    for (var day = 1; day <= daysInMonth; day++) {
        var dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
        var mins = d.dailyMinutes[dateStr] || 0;
        var level = mins === 0 ? 0 : Math.min(5, Math.ceil(mins / 30));
        var isToday = dateStr === todayStr ? ' border:2px solid rgba(108,99,255,0.6);' : '';
        html += '<div class="cal-day level-' + level + '" style="' + isToday + '" title="' + dateStr + '">' + day + '</div>';
    }
    container.innerHTML = html;
}

function renderWeeklyChart(today) {
    var container = document.getElementById('weeklyChart');
    if (!container) return;
    var days = getLast7Days(today);
    var maxMins = 60;
    days.forEach(function(day) { if ((d.dailyMinutes[day] || 0) > maxMins) maxMins = d.dailyMinutes[day]; });

    var html = '';
    days.forEach(function(day) {
        var mins = d.dailyMinutes[day] || 0;
        var h = mins > 0 ? Math.max(4, Math.round((mins / maxMins) * 100)) : 4;
        var date = new Date(day);
        var label = date.toLocaleDateString('zh-CN', {weekday:'short'});
        html += '<div class="bar-col">';
        html += '<div class="bar-col-bar" style="height:' + h + '%"></div>';
        html += '<div class="bar-col-label">' + label + '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function renderQuizHistory() {
    var container = document.getElementById('quizHistory');
    if (!container) return;
    if (d.quizScores.length === 0) return;

    var html = '';
    d.quizScores.slice(0, 5).forEach(function(q) {
        var badgeClass = q.score >= 80 ? 'badge-excellent' : q.score >= 60 ? 'badge-good' : q.score >= 40 ? 'badge-average' : 'badge-poor';
        var badgeText = q.score >= 80 ? '优秀' : q.score >= 60 ? '良好' : q.score >= 40 ? '及格' : '待提高';
        var bg = q.score >= 80 ? 'rgba(16,185,129,0.2)' : q.score >= 60 ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)';
        var color = q.score >= 80 ? '#10b981' : q.score >= 60 ? '#3b82f6' : '#f59e0b';
        html += '<div class="quiz-history-item">';
        html += '<div class="quiz-score-circle" style="background:' + bg + ';color:' + color + ';">' + q.score + '%</div>';
        html += '<div class="quiz-info"><h4>' + q.chapter + '</h4><p>' + q.date + ' · ' + q.correct + '/' + q.total + '题</p></div>';
        html += '<span class="quiz-badge ' + badgeClass + '">' + badgeText + '</span>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function renderActivities() {
    var container = document.getElementById('activityList');
    if (!container) return;
    if (d.activities.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding:1.5rem;"><span class="emoji">📌</span><p>开始学习后活动记录会显示在这里</p></div>';
        return;
    }
    var html = '';
    d.activities.slice(0, 8).forEach(function(a) {
        html += '<div class="activity-item">';
        html += '<div class="activity-dot"></div>';
        html += '<span class="activity-time">' + a.time + '</span>';
        html += '<span class="activity-text">' + a.text + '</span>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function renderSkills() {
    var container = document.getElementById('skillGrid');
    if (!container) return;
    var html = '';
    d.skills.forEach(function(s) {
        html += '<div class="skill-item">';
        html += '<div class="skill-name">' + s.name + '</div>';
        html += '<div class="skill-bar-wrap">';
        html += '<div class="skill-bar" style="width:' + s.pct + '%;background:' + s.color + ';"></div>';
        html += '</div>';
        html += '<div class="skill-pct" style="color:' + s.color + ';">' + s.pct + '%</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}

function renderBadges(completed, hours, quizAvg) {
    var container = document.getElementById('badgeGrid');
    if (!container) return;
    var badges = [
        { icon: '🎯', name: '初学者', condition: completed >= 0 },
        { icon: '📖', name: '第一章完成', condition: d.chapters[0].done },
        { icon: '🤖', name: 'AI入门', condition: completed >= 2 },
        { icon: '⚙️', name: 'Agent开发者', condition: d.chapters[3].done },
        { icon: '⏱️', name: '10小时学习', condition: hours >= 10 },
        { icon: '🔥', name: '30小时学习', condition: hours >= 30 },
        { icon: '🏆', name: '测验80%+', condition: quizAvg >= 80 },
        { icon: '🚀', name: '全部完成', condition: completed >= 6 },
    ];
    var html = '';
    badges.forEach(function(b) {
        html += '<div class="badge-item' + (b.condition ? ' unlocked' : '') + '">';
        html += '<div class="badge-icon">' + b.icon + '</div>';
        html += '<div class="badge-name">' + b.name + '</div>';
        html += '</div>';
    });
    container.innerHTML = html;
}

/* ===== 交互操作 ===== */

function markChapter(idx) {
    if (idx >= 0 && idx < d.chapters.length) {
        d.chapters[idx].done = !d.chapters[idx].done;
        addActivity((d.chapters[idx].done ? '✅ 完成章节：' : '↩️ 取消完成：') + d.chapters[idx].name);
        saveData();
        render();
        showToast(d.chapters[idx].name + (d.chapters[idx].done ? ' 已标记完成！' : ' 已取消完成'));
    }
}

function addSkill(name, increment) {
    d.skills.forEach(function(s) {
        if (s.name === name && s.pct < 100) {
            s.pct = Math.min(100, s.pct + increment);
        }
    });
    addActivity('技能提升：' + name + ' +' + increment + '%');
    saveData();
    render();
    showToast(name + ' 技能 +' + increment + '%');
}

function openGoalModal() {
    document.getElementById('goalModal').classList.add('show');
}
function closeGoalModal() {
    document.getElementById('goalModal').classList.remove('show');
}
function saveGoal() {
    d.goalDaysPerWeek = parseInt(document.getElementById('goalDays').value) || 5;
    d.goalHours = parseInt(document.getElementById('goalHours').value) || 100;
    d.startDate = document.getElementById('goalStartDate').value || new Date().toISOString().split('T')[0];
    saveData();
    render();
    closeGoalModal();
    showToast('目标已保存！');
}

function openLogModal() {
    document.getElementById('logDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('logHours').value = '1';
    document.getElementById('logModal').classList.add('show');
}
function closeLogModal() {
    document.getElementById('logModal').classList.remove('show');
}
function addHours(delta) {
    var input = document.getElementById('logHours');
    var val = parseFloat(input.value) || 0;
    input.value = Math.max(0, Math.round((val + delta) * 10) / 10);
}
function saveLog() {
    var date = document.getElementById('logDate').value;
    var hours = parseFloat(document.getElementById('logHours').value) || 0;
    if (hours <= 0) { showToast('请输入正确的学习时长'); return; }
    d.dailyMinutes[date] = (d.dailyMinutes[date] || 0) + Math.round(hours * 60);
    saveData();
    render();
    closeLogModal();
    addActivity('记录学习 ' + hours + ' 小时');
    showToast('已记录 ' + hours + ' 小时学习！');
}

function openQuizModal() {
    document.getElementById('quizModal').classList.add('show');
}
function closeQuizModal() {
    document.getElementById('quizModal').classList.remove('show');
}
function saveQuiz() {
    var chapter = document.getElementById('quizChapter').value;
    var correct = parseInt(document.getElementById('quizCorrect').value) || 0;
    var total = parseInt(document.getElementById('quizTotal').value) || 1;
    if (correct > total) { showToast('正确题数不能大于总题数'); return; }
    var score = Math.round(correct / total * 100);
    d.quizScores.unshift({
        chapter: chapter,
        score: score,
        correct: correct,
        total: total,
        date: new Date().toLocaleDateString('zh-CN')
    });
    if (d.quizScores.length > 20) d.quizScores = d.quizScores.slice(0, 20);
    saveData();
    render();
    closeQuizModal();
    addActivity('完成测验：' + chapter + ' ' + score + '%');
    showToast('测验成绩已记录：' + score + '%！');
}

function resetAll() {
    if (confirm('确定要重置所有学习数据吗？此操作不可恢复！')) {
        localStorage.removeItem('ai_learning_stats');
        d = getDefaultData();
        saveData();
        render();
        showToast('所有数据已重置！');
    }
}
