// Data untuk kuis
const quizData = {
    cell: [
        {
            question: "Organel manakah yang berfungsi sebagai pusat kendali sel?",
            options: ["Mitokondria", "Nukleus", "Ribosom", "Aparatus Golgi"],
            correctAnswer: 1
        },
        {
            question: "Organel apakah yang bertanggung jawab untuk menghasilkan energi dalam bentuk ATP?",
            options: ["Lisosom", "Mitokondria", "Retikulum Endoplasma", "Badan Golgi"],
            correctAnswer: 1
        },
        {
            question: "Organel manakah yang berfungsi dalam sintesis protein?",
            options: ["Mitokondria", "Nukleus", "Ribosom", "Vakuola"],
            correctAnswer: 2
        }
    ],
    organ: [
        {
            question: "Sistem organ manakah yang bertanggung jawab untuk pertukaran gas oksigen dan karbon dioksida?",
            options: ["Sistem Pencernaan", "Sistem Pernapasan", "Sistem Saraf", "Sistem Ekskresi"],
            correctAnswer: 1
        },
        {
            question: "Organ manakah yang merupakan bagian dari sistem pencernaan?",
            options: ["Jantung", "Paru-paru", "Otak", "Lambung"],
            correctAnswer: 3
        },
        {
            question: "Sistem organ apakah yang mengatur respons tubuh terhadap rangsangan?",
            options: ["Sistem Peredaran Darah", "Sistem Saraf", "Sistem Endokrin", "Sistem Rangka"],
            correctAnswer: 1
        }
    ],
    classification: [
        {
            question: "Manakah dari berikut ini yang termasuk dalam Kingdom Plantae?",
            options: ["Jamur merang", "Pohon mangga", "Bakteri Escherichia coli", "Harimau sumatera"],
            correctAnswer: 1
        },
        {
            question: "Makhluk hidup manakah yang termasuk dalam Kingdom Animalia?",
            options: ["Lumut", "Paku-pakuan", "Burung merpati", "Bakteri"],
            correctAnswer: 2
        },
        {
            question: "Organisme apakah yang termasuk dalam Kingdom Fungi?",
            options: ["Pohon jati", "Jamur tiram", "Ikan mas", "Bunga mawar"],
            correctAnswer: 1
        }
    ],
    general: [
        {
            question: "Organel sel manakah yang berfungsi sebagai tempat respirasi seluler?",
            options: ["Lisosom", "Mitokondria", "Retikulum Endoplasma", "Badan Golgi"],
            correctAnswer: 1
        },
        {
            question: "Proses fotosintesis terjadi pada bagian tumbuhan yang bernama?",
            options: ["Akar", "Batang", "Daun", "Bunga"],
            correctAnswer: 2
        },
        {
            question: "Bagian sel yang berfungsi sebagai pelindung dan pengatur keluar masuknya zat adalah?",
            options: ["Membran sel", "Dinding sel", "Sitoplasma", "Nukleus"],
            correctAnswer: 0
        }
    ]
};

// Variabel global
let currentTab = 'home';
let userScore = 0;
let learningProgress = 0;
let currentQuestionIndex = 0;
let currentQuizType = 'cell';
let correctAnswers = 0;
let wrongAnswers = 0;
let questionsAnswered = 0;
const totalQuestions = 5;

// Fungsi untuk mengganti tab
function switchTab(tabId) {
    // Nonaktifkan semua tab
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Aktifkan tab yang dipilih
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    currentTab = tabId;
    
    // Update progress belajar berdasarkan tab yang dikunjungi
    updateLearningProgress();
    
    // Reset pilihan jawaban di kuis
    resetOptions();
    
    // Inisialisasi kuis jika tab kuis yang dipilih
    if (tabId === 'quiz') {
        initializeQuiz();
    }
}

// Fungsi untuk update progress belajar
function updateLearningProgress() {
    // Setiap kali pengguna mengunjungi tab baru, tambah progress
    const visitedTabs = new Set();
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.classList.contains('visited')) {
            visitedTabs.add(button.getAttribute('data-tab'));
        }
    });
    
    // Tandai tab saat ini sebagai sudah dikunjungi
    document.querySelector(`[data-tab="${currentTab}"]`).classList.add('visited');
    visitedTabs.add(currentTab);
    
    // Hitung progress (maksimal 5 tab)
    learningProgress = Math.min((visitedTabs.size / 5) * 100, 100);
    
    // Update tampilan progress
    document.getElementById('progress-percent').textContent = `${Math.round(learningProgress)}%`;
    document.getElementById('learning-progress').style.width = `${learningProgress}%`;
    
    // Update tingkat kesulitan berdasarkan progress
    let difficultyText = "Pemula";
    if (learningProgress < 30) {
        difficultyText = "Pemula";
    } else if (learningProgress < 70) {
        difficultyText = "Menengah";
    } else {
        difficultyText = "Mahir";
    }
    document.getElementById('difficulty').textContent = difficultyText;
}

// Fungsi untuk reset pilihan jawaban
function resetOptions() {
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    document.querySelectorAll('.result').forEach(result => {
        result.style.display = 'none';
        result.textContent = '';
    });
}

// Fungsi untuk memilih jawaban
function selectOption(optionElement) {
    // Reset semua pilihan di tab yang aktif
    const activeTabOptions = document.querySelector(`#${currentTab} .options`);
    if (activeTabOptions) {
        activeTabOptions.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }
    
    // Tandai pilihan yang dipilih
    optionElement.classList.add('selected');
}

// Fungsi untuk memeriksa jawaban
function checkAnswer(questionType) {
    const activeTab = document.getElementById(currentTab);
    const selectedOption = activeTab.querySelector('.option.selected');
    
    if (!selectedOption) {
        alert('Silakan pilih jawaban terlebih dahulu!');
        return;
    }
    
    let correctIndex;
    let questionData;
    
    // Tentukan data pertanyaan berdasarkan tipe
    if (questionType === 'cell') {
        questionData = quizData.cell[currentQuestionIndex % quizData.cell.length];
        correctIndex = questionData.correctAnswer;
    } else if (questionType === 'organ') {
        questionData = quizData.organ[currentQuestionIndex % quizData.organ.length];
        correctIndex = questionData.correctAnswer;
    } else if (questionType === 'classification') {
        questionData = quizData.classification[currentQuestionIndex % quizData.classification.length];
        correctIndex = questionData.correctAnswer;
    }
    
    const selectedIndex = parseInt(selectedOption.getAttribute('data-answer').charCodeAt(0) - 97);
    const isCorrect = selectedIndex === correctIndex;
    
    // Tampilkan hasil
    const resultElement = activeTab.querySelector('.result');
    if (isCorrect) {
        resultElement.textContent = "Benar! Jawaban Anda tepat.";
        resultElement.className = "result correct";
        userScore += 10;
        
        // Update statistik kuis
        if (currentTab === 'quiz') {
            correctAnswers++;
            document.getElementById('correct-answers').textContent = correctAnswers;
        }
    } else {
        const correctAnswerText = String.fromCharCode(97 + correctIndex).toUpperCase() + ". " + questionData.options[correctIndex];
        resultElement.textContent = `Salah. Jawaban yang benar adalah: ${correctAnswerText}`;
        resultElement.className = "result incorrect";
        
        // Update statistik kuis
        if (currentTab === 'quiz') {
            wrongAnswers++;
            document.getElementById('wrong-answers').textContent = wrongAnswers;
        }
    }
    
    resultElement.style.display = 'block';
    
    // Tandai jawaban yang benar dan salah
    const options = activeTab.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (option.classList.contains('selected') && index !== correctIndex) {
            option.classList.add('incorrect');
        }
    });
    
    // Update skor
    document.getElementById('quiz-score').textContent = userScore;
}

// Fungsi untuk pertanyaan berikutnya
function nextQuestion(questionType) {
    currentQuestionIndex++;
    
    // Reset tampilan kuis
    resetOptions();
    
    // Tampilkan pertanyaan baru berdasarkan tipe
    let questionData;
    if (questionType === 'cell') {
        questionData = quizData.cell[currentQuestionIndex % quizData.cell.length];
    } else if (questionType === 'organ') {
        questionData = quizData.organ[currentQuestionIndex % quizData.organ.length];
    } else if (questionType === 'classification') {
        questionData = quizData.classification[currentQuestionIndex % quizData.classification.length];
    }
    
    const activeTab = document.getElementById(currentTab);
    const questionElement = activeTab.querySelector('.question');
    const optionsElements = activeTab.querySelectorAll('.option');
    
    if (questionElement && questionData) {
        questionElement.textContent = questionData.question;
        
        optionsElements.forEach((option, index) => {
            option.textContent = `${String.fromCharCode(97 + index).toUpperCase()}. ${questionData.options[index]}`;
            option.setAttribute('data-answer', String.fromCharCode(97 + index));
        });
    }
}

// Fungsi untuk inisialisasi kuis di tab kuis
function initializeQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    questionsAnswered = 0;
    
    // Update statistik kuis
    document.getElementById('correct-answers').textContent = "0";
    document.getElementById('wrong-answers').textContent = "0";
    document.getElementById('questions-left').textContent = totalQuestions;
    
    // Tampilkan pertanyaan pertama
    loadQuizQuestion();
}

// Fungsi untuk memuat pertanyaan kuis
function loadQuizQuestion() {
    // Pilih jenis kuis secara acak
    const quizTypes = ['cell', 'organ', 'classification', 'general'];
    currentQuizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    
    const questionData = quizData[currentQuizType][currentQuestionIndex % quizData[currentQuizType].length];
    
    const questionElement = document.getElementById('quiz-question');
    const optionsElements = document.querySelectorAll('#quiz-options .option');
    
    questionElement.textContent = questionData.question;
    
    optionsElements.forEach((option, index) => {
        option.textContent = `${String.fromCharCode(97 + index).toUpperCase()}. ${questionData.options[index]}`;
        option.setAttribute('data-answer', String.fromCharCode(97 + index));
    });
    
    // Reset tampilan
    resetOptions();
    const resultElement = document.getElementById('quiz-result');
    resultElement.style.display = 'none';
}

// Fungsi untuk memeriksa jawaban kuis
function checkQuizAnswer() {
    const selectedOption = document.querySelector('#quiz-options .option.selected');
    
    if (!selectedOption) {
        alert('Silakan pilih jawaban terlebih dahulu!');
        return;
    }
    
    const questionData = quizData[currentQuizType][currentQuestionIndex % quizData[currentQuizType].length];
    const correctIndex = questionData.correctAnswer;
    const selectedIndex = parseInt(selectedOption.getAttribute('data-answer').charCodeAt(0) - 97);
    const isCorrect = selectedIndex === correctIndex;
    
    // Tampilkan hasil
    const resultElement = document.getElementById('quiz-result');
    if (isCorrect) {
        resultElement.textContent = "Benar! Jawaban Anda tepat.";
        resultElement.className = "result correct";
        userScore += 10;
        correctAnswers++;
        document.getElementById('correct-answers').textContent = correctAnswers;
    } else {
        const correctAnswerText = String.fromCharCode(97 + correctIndex).toUpperCase() + ". " + questionData.options[correctIndex];
        resultElement.textContent = `Salah. Jawaban yang benar adalah: ${correctAnswerText}`;
        resultElement.className = "result incorrect";
        wrongAnswers++;
        document.getElementById('wrong-answers').textContent = wrongAnswers;
    }
    
    resultElement.style.display = 'block';
    
    // Tandai jawaban yang benar dan salah
    const options = document.querySelectorAll('#quiz-options .option');
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (option.classList.contains('selected') && index !== correctIndex) {
            option.classList.add('incorrect');
        }
    });
    
    // Update skor
    document.getElementById('quiz-score').textContent = userScore;
    questionsAnswered++;
    document.getElementById('questions-left').textContent = totalQuestions - questionsAnswered;
    
    // Jika sudah menjawab semua pertanyaan
    if (questionsAnswered >= totalQuestions) {
        setTimeout(() => {
            alert(`Kuis selesai! Skor akhir Anda: ${userScore}\nJawaban benar: ${correctAnswers}\nJawaban salah: ${wrongAnswers}`);
        }, 500);
    }
}

// Fungsi untuk pertanyaan kuis berikutnya
function nextQuizQuestion() {
    if (questionsAnswered >= totalQuestions) {
        alert("Kuis sudah selesai! Silakan mulai kuis baru.");
        return;
    }
    
    currentQuestionIndex++;
    loadQuizQuestion();
}

// Inisialisasi event listeners setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Mulai belajar button
    document.getElementById('start-learning').addEventListener('click', () => {
        switchTab('cell');
    });

    // Kuis cepat button
    document.getElementById('quick-quiz').addEventListener('click', () => {
        switchTab('quiz');
    });

    // Organelle labels
    document.querySelectorAll('.organelle-label').forEach(label => {
        label.addEventListener('click', () => {
            const organelle = label.getAttribute('data-organelle');
            let info = '';
            
            switch(organelle) {
                case 'nucleus':
                    info = 'Nukleus adalah pusat kendali sel yang mengandung materi genetik (DNA).';
                    break;
                case 'mitochondria':
                    info = 'Mitokondria adalah organel yang berfungsi sebagai tempat respirasi seluler untuk menghasilkan energi (ATP).';
                    break;
                case 'golgi':
                    info = 'Aparatus Golgi berfungsi dalam modifikasi, penyortiran, dan pengemasan protein untuk distribusi.';
                    break;
                default:
                    info = 'Klik bagian sel untuk mempelajari lebih lanjut tentang organel sel.';
            }
            
            alert(`Informasi: ${info}`);
        });
    });

    // Pilihan jawaban
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            selectOption(option);
        });
    });

    // Check answer buttons
    document.getElementById('check-answer').addEventListener('click', () => {
        if (currentTab === 'cell') {
            checkAnswer('cell');
        }
    });
    
    document.getElementById('check-answer-organ').addEventListener('click', () => {
        if (currentTab === 'organ') {
            checkAnswer('organ');
        }
    });
    
    document.getElementById('check-answer-classification').addEventListener('click', () => {
        if (currentTab === 'classification') {
            checkAnswer('classification');
        }
    });

    // Next question buttons
    document.getElementById('next-question').addEventListener('click', () => {
        if (currentTab === 'cell') {
            nextQuestion('cell');
        }
    });
    
    document.getElementById('next-question-organ').addEventListener('click', () => {
        if (currentTab === 'organ') {
            nextQuestion('organ');
        }
    });
    
    document.getElementById('next-question-classification').addEventListener('click', () => {
        if (currentTab === 'classification') {
            nextQuestion('classification');
        }
    });

    // Kuis check answer button
    document.getElementById('check-quiz-answer').addEventListener('click', checkQuizAnswer);

    // Kuis next question button
    document.getElementById('next-quiz-question').addEventListener('click', nextQuizQuestion);

    // Restart quiz button
    document.getElementById('restart-quiz').addEventListener('click', initializeQuiz);

    // Inisialisasi
    updateLearningProgress();
    initializeQuiz();
    
    // Tampilkan pesan selamat datang
    setTimeout(() => {
        if (currentTab === 'home') {
            alert("Selamat datang di Game Pembelajaran Biologi! Pilih topik dari menu di sebelah kiri untuk mulai belajar.");
        }
    }, 1000);
});