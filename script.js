/**
 * GPA Calculator by Macklin
 * File: script.js
 * Version: 2.0
 */

// ========== GLOBAL VARIABLES ==========
let subjects = [];

// DOM Elements
const subjectNameInput = document.getElementById('subjectName');
const subjectCreditInput = document.getElementById('subjectCredit');
const subjectGradeInput = document.getElementById('subjectGrade');
const addSubjectBtn = document.getElementById('addSubject');
const calculateGpaBtn = document.getElementById('calculateGPA');
const subjectsContainer = document.getElementById('subjectsContainer');
const emptyState = document.getElementById('emptyState');
const resultContainer = document.getElementById('resultContainer');
const gpaValue = document.getElementById('gpaValue');
const gpaStatus = document.getElementById('gpaStatus');
const totalCreditsSpan = document.getElementById('totalCredits');
const totalSubjectsSpan = document.getElementById('totalSubjects');
const totalQualityPointsSpan = document.getElementById('totalQualityPoints');

// ========== GRADE MAPPINGS ==========
const gradeToLetter = {
    '4.00': 'A',
    '3.70': 'A-',
    '3.30': 'B+',
    '3.00': 'B',
    '2.70': 'B-',
    '2.30': 'C+',
    '2.00': 'C',
    '1.70': 'C-',
    '1.30': 'D+',
    '1.00': 'D',
    '0.00': 'E'
};

const gradeToClass = {
    '4.00': 'grade-A',
    '3.70': 'grade-A',
    '3.30': 'grade-B',
    '3.00': 'grade-B',
    '2.70': 'grade-B',
    '2.30': 'grade-C',
    '2.00': 'grade-C',
    '1.70': 'grade-C',
    '1.30': 'grade-D',
    '1.00': 'grade-D',
    '0.00': 'grade-E'
};

// ========== GPA STATUS FUNCTION ==========
function getGPAStatus(gpa) {
    const statuses = [
        { min: 3.85, max: 4.00, status: 'SUMMA CUM LAUDE', color: '#4ade80', emoji: '🏆' },
        { min: 3.70, max: 3.84, status: 'MAGNA CUM LAUDE', color: '#22c55e', emoji: '🎖️' },
        { min: 3.50, max: 3.69, status: 'CUM LAUDE', color: '#16a34a', emoji: '⭐' },
        { min: 3.30, max: 3.49, status: 'SANGAT MEMUASKAN', color: '#60a5fa', emoji: '👍' },
        { min: 3.00, max: 3.29, status: 'MEMUASKAN', color: '#3b82f6', emoji: '👌' },
        { min: 2.70, max: 2.99, status: 'BAIK', color: '#8b5cf6', emoji: '✅' },
        { min: 2.30, max: 2.69, status: 'CUKUP BAIK', color: '#f59e0b', emoji: '🔶' },
        { min: 2.00, max: 2.29, status: 'CUKUP', color: '#f97316', emoji: '⚠️' },
        { min: 1.70, max: 1.99, status: 'KURANG', color: '#ef4444', emoji: '🔻' },
        { min: 1.00, max: 1.69, status: 'SANGAT KURANG', color: '#dc2626', emoji: '❌' },
        { min: 0.00, max: 0.99, status: 'GAGAL', color: '#991b1b', emoji: '💀' }
    ];
    
    for (const range of statuses) {
        if (gpa >= range.min && gpa <= range.max) {
            return {
                status: `${range.emoji} ${range.status}`,
                color: range.color,
                gradient: `linear-gradient(135deg, ${range.color}, #8a2be2)`
            };
        }
    }
    
    return {
        status: '❓ TIDAK TERDEFINISI',
        color: '#666',
        gradient: 'linear-gradient(135deg, #666, #8a2be2)'
    };
}

// ========== ADD SUBJECT FUNCTION ==========
function addSubject() {
    const name = subjectNameInput.value.trim();
    const credit = parseInt(subjectCreditInput.value);
    const gradeValue = parseFloat(subjectGradeInput.value);
    
    // Validation
    if (!name) {
        showAlert('Mohon masukkan nama mata kuliah', 'warning');
        subjectNameInput.focus();
        return;
    }
    
    if (credit < 1 || credit > 8) {
        showAlert('SKS harus antara 1-8', 'warning');
        return;
    }
    
    // Add to subjects array
    const subject = {
        id: Date.now() + Math.random(),
        name,
        credit,
        gradeValue,
        letterGrade: gradeToLetter[gradeValue.toFixed(2)]
    };
    
    subjects.push(subject);
    
    // Clear input and focus
    subjectNameInput.value = '';
    subjectNameInput.focus();
    
    // Update UI
    renderSubjects();
    updateEmptyState();
    
    // Show success message
    showAlert(`"${name}" berhasil ditambahkan!`, 'success');
}

// ========== CALCULATE GPA FUNCTION ==========
function calculateGPA() {
    if (subjects.length === 0) {
        showAlert('Tambahkan minimal satu mata kuliah terlebih dahulu', 'warning');
        return;
    }
    
    let totalQualityPoints = 0;
    let totalCredits = 0;
    
    // Calculate total quality points and credits
    subjects.forEach(subject => {
        totalQualityPoints += subject.gradeValue * subject.credit;
        totalCredits += subject.credit;
    });
    
    const gpa = totalQualityPoints / totalCredits;
    const formattedGPA = gpa.toFixed(2);
    
    // Get GPA status
    const gpaInfo = getGPAStatus(parseFloat(formattedGPA));
    
    // Update UI
    updateResults(formattedGPA, gpaInfo, totalQualityPoints, totalCredits);
    
    // Show success message
    showAlert(`IPK berhasil dihitung: ${formattedGPA}`, 'success');
}

// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(gpa, gpaInfo, qualityPoints, credits) {
    // Update GPA value
    gpaValue.textContent = gpa;
    gpaValue.style.background = gpaInfo.gradient;
    
    // Update status
    gpaStatus.textContent = gpaInfo.status;
    gpaStatus.style.backgroundColor = gpaInfo.color + '20';
    gpaStatus.style.color = gpaInfo.color;
    gpaStatus.style.border = `2px solid ${gpaInfo.color}40`;
    gpaStatus.style.boxShadow = `0 5px 20px ${gpaInfo.color}30`;
    
    // Update details
    totalCreditsSpan.textContent = credits;
    totalSubjectsSpan.textContent = subjects.length;
    totalQualityPointsSpan.textContent = qualityPoints.toFixed(2);
    
    // Show result container
    resultContainer.classList.add('show');
}

// ========== DELETE SUBJECT FUNCTION ==========
function deleteSubject(id) {
    // Find subject index
    const index = subjects.findIndex(subject => subject.id === id);
    
    if (index !== -1) {
        const subjectName = subjects[index].name;
        
        // Remove from array
        subjects.splice(index, 1);
        
        // Update UI
        renderSubjects();
        updateEmptyState();
        
        // Hide result if no subjects
        if (subjects.length === 0) {
            resultContainer.classList.remove('show');
        }
        
        // Show delete message
        showAlert(`"${subjectName}" telah dihapus`, 'info');
    }
}

// ========== RENDER SUBJECTS LIST ==========
function renderSubjects() {
    if (subjects.length === 0) {
        subjectsContainer.innerHTML = '';
        subjectsContainer.appendChild(emptyState);
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    let html = '';
    subjects.forEach(subject => {
        const gradeKey = subject.gradeValue.toFixed(2);
        html += `
            <div class="subject-item">
                <div class="subject-name">
                    <i class="fas fa-book-open" style="margin-right: 10px; color: #8a2be2;"></i>
                    ${subject.name}
                </div>
                <div class="subject-credit">
                    <i class="fas fa-weight" style="margin-right: 8px;"></i>
                    ${subject.credit} SKS
                </div>
                <div class="subject-grade ${gradeToClass[gradeKey]}">
                    ${subject.letterGrade} (${gradeKey})
                </div>
                <button class="delete-btn" onclick="deleteSubject(${subject.id})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        `;
    });
    
    subjectsContainer.innerHTML = html;
}

// ========== UPDATE EMPTY STATE ==========
function updateEmptyState() {
    if (subjects.length > 0) {
        emptyState.style.display = 'none';
    } else {
        emptyState.style.display = 'block';
    }
}

// ========== SHOW ALERT FUNCTION ==========
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(74, 222, 128, 0.15)' : 
                     type === 'warning' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(96, 165, 250, 0.15)'};
        color: ${type === 'success' ? '#4ade80' : 
                type === 'warning' ? '#fbbf24' : '#60a5fa'};
        border: 1px solid ${type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 
                          type === 'warning' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(96, 165, 250, 0.3)'};
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        z-index: 1000;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add keyframe animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========== INITIALIZE EVENT LISTENERS ==========
function initializeEventListeners() {
    // Add subject button
    addSubjectBtn.addEventListener('click', addSubject);
    
    // Calculate GPA button
    calculateGpaBtn.addEventListener('click', calculateGPA);
    
    // Enter key to add subject
    subjectNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSubject();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            calculateGPA();
        }
    });
}

// ========== LOAD SAMPLE DATA (FOR TESTING) ==========
function loadSampleData() {
    // Only load if no subjects exist
    if (subjects.length === 0 && localStorage.getItem('sampleLoaded') !== 'true') {
        const sampleData = [
            { name: 'Struktur Data', credit: 4, gradeValue: 4.00 },
            { name: 'Basis Data', credit: 3, gradeValue: 3.70 },
            { name: 'Algoritma', credit: 3, gradeValue: 3.30 }
        ];
        
        sampleData.forEach(data => {
            subjects.push({
                id: Date.now() + Math.random(),
                name: data.name,
                credit: data.credit,
                gradeValue: data.gradeValue,
                letterGrade: gradeToLetter[data.gradeValue.toFixed(2)]
            });
        });
        
        localStorage.setItem('sampleLoaded', 'true');
        renderSubjects();
        updateEmptyState();
    }
}

// ========== INITIALIZE APP ==========
function initializeApp() {
    initializeEventListeners();
    renderSubjects();
    
    // Uncomment line below to enable sample data on first load
    // loadSampleData();
    
    console.log('✅ GPA Calculator successfully!');
}

// ========== START APPLICATION ==========
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally (for onclick attributes)
window.deleteSubject = deleteSubject;
