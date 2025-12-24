/**
 * GPA Calculator
 * File: script.js
 * Version: 2.2 (Fixed GPA Value Visibility)
 */

// ========== GLOBAL VARIABLES ==========
let subjects = [];

// DOM Elements
let subjectNameInput, subjectCreditInput, subjectGradeInput;
let addSubjectBtn, calculateGpaBtn, subjectsContainer;
let emptyState, resultContainer, gpaValue, gpaStatus;
let totalCreditsSpan, totalSubjectsSpan, totalQualityPointsSpan;

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

// ========== INITIALIZE DOM ELEMENTS ==========
function initializeDOMElements() {
    subjectNameInput = document.getElementById('subjectName');
    subjectCreditInput = document.getElementById('subjectCredit');
    subjectGradeInput = document.getElementById('subjectGrade');
    addSubjectBtn = document.getElementById('addSubject');
    calculateGpaBtn = document.getElementById('calculateGPA');
    subjectsContainer = document.getElementById('subjectsContainer');
    emptyState = document.getElementById('emptyState');
    resultContainer = document.getElementById('resultContainer');
    gpaValue = document.getElementById('gpaValue');
    gpaStatus = document.getElementById('gpaStatus');
    totalCreditsSpan = document.getElementById('totalCredits');
    totalSubjectsSpan = document.getElementById('totalSubjects');
    totalQualityPointsSpan = document.getElementById('totalQualityPoints');
}

// ========== ADD SUBJECT FUNCTION ==========
function addSubject() {
    const name = subjectNameInput.value.trim();
    const credit = parseInt(subjectCreditInput.value);
    const gradeValue = parseFloat(subjectGradeInput.value);
    
    // Validation
    if (!name) {
        alert('⚠️ Mohon masukkan nama mata kuliah');
        subjectNameInput.focus();
        return;
    }
    
    if (credit < 1 || credit > 8) {
        alert('⚠️ SKS harus antara 1-8');
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
    showMessage(`✅ "${name}" berhasil ditambahkan!`);
}

// ========== CALCULATE GPA FUNCTION ==========
function calculateGPA() {
    if (subjects.length === 0) {
        alert('⚠️ Tambahkan minimal satu mata kuliah terlebih dahulu');
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
    showMessage(`🎓 IPK berhasil dihitung: ${formattedGPA}`);
}

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
                emoji: range.emoji
            };
        }
    }
    
    return {
        status: '❓ TIDAK TERDEFINISI',
        color: '#666',
        emoji: '❓'
    };
}

// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(gpa, gpaInfo, qualityPoints, credits) {
    // Update GPA value - FIXED: Warna solid agar terlihat jelas
    gpaValue.textContent = gpa;
    gpaValue.style.color = gpaInfo.color;
    gpaValue.style.textShadow = `0 0 20px ${gpaInfo.color}80, 0 5px 15px rgba(0, 0, 0, 0.3)`;
    
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
        showMessage(`🗑️ "${subjectName}" telah dihapus`);
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

// ========== SHOW MESSAGE FUNCTION ==========
function showMessage(message) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(74, 222, 128, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add animation styles for messages
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

// ========== SAVE TO LOCALSTORAGE ==========
function saveToLocalStorage() {
    try {
        localStorage.setItem('gpaSubjects', JSON.stringify(subjects));
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// ========== LOAD FROM LOCALSTORAGE ==========
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('gpaSubjects');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure all subjects have required properties
            subjects = parsed.filter(subject => 
                subject.name && subject.credit && subject.gradeValue
            );
            return true;
        }
    } catch (e) {
        console.log('Error loading from localStorage');
    }
    return false;
}

// ========== INITIALIZE APP ==========
function initializeApp() {
    initializeDOMElements();
    initializeEventListeners();
    
    // Load saved data
    if (loadFromLocalStorage()) {
        renderSubjects();
        if (subjects.length > 0) {
            showMessage('📁 Data sebelumnya dimuat otomatis');
        }
    } else {
        renderSubjects();
    }
    
    // Auto-save when leaving page
    window.addEventListener('beforeunload', saveToLocalStorage);
}

// ========== START APPLICATION ==========
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally
window.deleteSubject = deleteSubject;
window.addSubject = addSubject;
window.calculateGPA = calculateGPA;
