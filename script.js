/**
 * GPA Calculator by Macklin
 * File: script.js
 * Version: 2.1 (Fixed)
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
    
    console.log('DOM Elements loaded:', {
        addSubjectBtn: !!addSubjectBtn,
        calculateGpaBtn: !!calculateGpaBtn,
        subjectNameInput: !!subjectNameInput
    });
}

// ========== ADD SUBJECT FUNCTION ==========
function addSubject() {
    console.log('addSubject function called!');
    
    const name = subjectNameInput.value.trim();
    const credit = parseInt(subjectCreditInput.value);
    const gradeValue = parseFloat(subjectGradeInput.value);
    
    console.log('Input values:', { name, credit, gradeValue });
    
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
    console.log('Subject added:', subject);
    console.log('Total subjects:', subjects.length);
    
    // Clear input and focus
    subjectNameInput.value = '';
    subjectNameInput.focus();
    
    // Update UI
    renderSubjects();
    updateEmptyState();
    
    // Show success message
    showMessage(`✅ "${name}" berhasil ditambahkan!`, 'success');
}

// ========== CALCULATE GPA FUNCTION ==========
function calculateGPA() {
    console.log('calculateGPA function called!');
    
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
    
    console.log('Calculation:', {
        totalQualityPoints,
        totalCredits,
        gpa: formattedGPA
    });
    
    // Get GPA status
    const gpaInfo = getGPAStatus(parseFloat(formattedGPA));
    
    // Update UI
    updateResults(formattedGPA, gpaInfo, totalQualityPoints, totalCredits);
    
    // Show success message
    showMessage(`🎓 IPK berhasil dihitung: ${formattedGPA}`, 'success');
}

// ========== GPA STATUS FUNCTION ==========
function getGPAStatus(gpa) {
    const statuses = [
        { min: 3.85, max: 4.00, status: 'SUMMA CUM LAUDE', color: '#4ade80' },
        { min: 3.70, max: 3.84, status: 'MAGNA CUM LAUDE', color: '#22c55e' },
        { min: 3.50, max: 3.69, status: 'CUM LAUDE', color: '#16a34a' },
        { min: 3.30, max: 3.49, status: 'SANGAT MEMUASKAN', color: '#60a5fa' },
        { min: 3.00, max: 3.29, status: 'MEMUASKAN', color: '#3b82f6' },
        { min: 2.70, max: 2.99, status: 'BAIK', color: '#8b5cf6' },
        { min: 2.30, max: 2.69, status: 'CUKUP BAIK', color: '#f59e0b' },
        { min: 2.00, max: 2.29, status: 'CUKUP', color: '#f97316' },
        { min: 1.70, max: 1.99, status: 'KURANG', color: '#ef4444' },
        { min: 1.00, max: 1.69, status: 'SANGAT KURANG', color: '#dc2626' },
        { min: 0.00, max: 0.99, status: 'GAGAL', color: '#991b1b' }
    ];
    
    for (const range of statuses) {
        if (gpa >= range.min && gpa <= range.max) {
            return {
                status: range.status,
                color: range.color,
                gradient: `linear-gradient(135deg, ${range.color}, #8a2be2)`
            };
        }
    }
    
    return {
        status: 'TIDAK TERDEFINISI',
        color: '#666',
        gradient: 'linear-gradient(135deg, #666, #8a2be2)'
    };
}

// ========== UPDATE RESULTS DISPLAY ==========
function updateResults(gpa, gpaInfo, qualityPoints, credits) {
    // Update GPA value
    gpaValue.textContent = gpa;
    gpaValue.style.background = gpaInfo.gradient;
    gpaValue.style.webkitBackgroundClip = 'text';
    gpaValue.style.backgroundClip = 'text';
    
    // Update status
    gpaStatus.textContent = gpaInfo.status;
    gpaStatus.style.backgroundColor = gpaInfo.color + '20';
    gpaStatus.style.color = gpaInfo.color;
    gpaStatus.style.border = `1px solid ${gpaInfo.color}40`;
    
    // Update details
    totalCreditsSpan.textContent = credits;
    totalSubjectsSpan.textContent = subjects.length;
    totalQualityPointsSpan.textContent = qualityPoints.toFixed(2);
    
    // Show result container
    resultContainer.classList.add('show');
}

// ========== DELETE SUBJECT FUNCTION ==========
function deleteSubject(id) {
    console.log('Deleting subject with id:', id);
    
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
        showMessage(`🗑️ "${subjectName}" telah dihapus`, 'info');
    }
}

// ========== RENDER SUBJECTS LIST ==========
function renderSubjects() {
    console.log('Rendering subjects:', subjects);
    
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
                <div class="subject-name">${subject.name}</div>
                <div class="subject-credit">${subject.credit} SKS</div>
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
function showMessage(message, type = 'info') {
    // Simple alert for now
    console.log(`${type.toUpperCase()}: ${message}`);
}

// ========== INITIALIZE EVENT LISTENERS ==========
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Add subject button
    addSubjectBtn.addEventListener('click', addSubject);
    console.log('addSubject event listener added');
    
    // Calculate GPA button
    calculateGpaBtn.addEventListener('click', calculateGPA);
    console.log('calculateGPA event listener added');
    
    // Enter key to add subject
    subjectNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSubject();
        }
    });
}

// ========== INITIALIZE APP ==========
function initializeApp() {
    console.log('🚀 Initializing GPA Calculator...');
    
    initializeDOMElements();
    initializeEventListeners();
    renderSubjects();
    
    console.log('✅ App initialized successfully!');
    console.log('Subjects array:', subjects);
    console.log('Test: Type "addSubject()" in console to test function');
}

// ========== START APPLICATION ==========
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally
window.deleteSubject = deleteSubject;
window.addSubject = addSubject;
window.calculateGPA = calculateGPA;
