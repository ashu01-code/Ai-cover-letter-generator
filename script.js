(function() {
    'use strict';

    var form = document.getElementById('coverLetterForm');
    var outputContainer = document.getElementById('outputContainer');
    var copyBtn = document.getElementById('copyBtn');
    var generateBtn = document.getElementById('generateBtn');
    var clearBtn = document.getElementById('clearBtn');
    var dropzone = document.getElementById('dropzone');
    var fileInput = document.getElementById('resumeUpload');
    var resumeText = '';
    var currentCoverLetter = '';

    function showNotification(message, type) {
        var existing = document.querySelector('.notification');
        if (existing) existing.remove();

        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        var bgColor = type === 'error' ? '#fc8181' : '#48bb78';
        notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:8px;color:white;font-weight:600;z-index:1000;animation:slideIn 0.3s ease;background:' + bgColor + ';box-shadow:0 10px 20px rgba(0,0,0,0.1);';

        document.body.appendChild(notification);
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { notification.remove(); }, 300);
        }, 3000);
    }

    function showLoadingState() {
        outputContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating your professional cover letter...</p></div>';
    }

    function showErrorState() {
        outputContainer.innerHTML = '<div class="placeholder" style="color:#fc8181;"><p>Failed to generate cover letter. Please try again.</p></div>';
    }

    function renderCoverLetter(coverLetter) {
        var paragraphs = coverLetter.split(/\n\s*\n/);
        var formattedHtml = '';
        for (var i = 0; i < paragraphs.length; i++) {
            if (paragraphs[i].trim()) {
                formattedHtml += '<p>' + paragraphs[i].replace(/\n/g, ' ').trim() + '</p>';
            }
        }

        outputContainer.innerHTML = '<div class="cover-letter-content">' + formattedHtml + '</div>';
    }

    function generateWithTemplate(name, role, company, skills, resumeText) {
        var dateObj = new Date();
        var date = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        var skillsList = skills.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
        var skillsParagraph = '';
        if (skillsList.length > 0) {
            skillsParagraph = 'My expertise spans ' + skillsList.join(', ') + ', which I believe aligns perfectly with your requirements.';
        } else {
            skillsParagraph = 'My skill set matches the requirements for the ' + role + ' position.';
        }

        var resumeParagraph = resumeText ? '\n\nBased on my professional background, I have developed strong competencies that will allow me to contribute effectively to your team.' : '';

        return '[' + date + ']\n\nDear Hiring Manager at ' + company + ',\n\nI am writing to express my strong interest in the ' + role + ' position at ' + company + '. As a passionate professional with a commitment to excellence, I am excited about the opportunity to contribute to your organization\'s success.\n\n' + skillsParagraph + resumeParagraph + '\n\nThroughout my career, I have cultivated the ability to adapt quickly to new challenges and deliver results in dynamic environments. I am confident that my background and dedication to continuous learning make me a valuable candidate for this role.\n\nI am enthusiastic about the chance to bring my expertise to ' + company + ' and contribute to your team\'s objectives. Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nSincerely,\n' + name;
    }

    function handleSubmit(e) {
        e.preventDefault();

        var name = document.getElementById('candidateName').value.trim();
        var role = document.getElementById('jobRole').value.trim();
        var company = document.getElementById('targetCompany').value.trim();
        var skills = document.getElementById('keySkills').value.trim();

        if (!name || !role || !company || !skills) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        generateBtn.disabled = true;
        copyBtn.disabled = true;
        showLoadingState();

        try {
            var coverLetter = generateWithTemplate(name, role, company, skills, resumeText);
            currentCoverLetter = coverLetter;
            renderCoverLetter(coverLetter);
            copyBtn.disabled = false;
            generateBtn.disabled = false;
        } catch (error) {
            console.error('Generation failed:', error);
            showErrorState();
            generateBtn.disabled = false;
        }
    }

    function copyToClipboard() {
        if (!currentCoverLetter) return;

        var textToCopy = currentCoverLetter;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(function() {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(function() {
                    copyBtn.textContent = 'Copy to Clipboard';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(function() {
                fallbackCopy(textToCopy);
            });
        } else {
            fallbackCopy(textToCopy);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(function() {
            copyBtn.textContent = 'Copy to Clipboard';
            copyBtn.classList.remove('copied');
        }, 2000);
    }

    function clearForm() {
        form.reset();
        resumeText = '';
        currentCoverLetter = '';
        copyBtn.disabled = true;
        generateBtn.disabled = false;
        outputContainer.innerHTML = '<div class="placeholder"><p>Your generated cover letter will appear here</p></div>';
        var fileNameDisplay = dropzone.querySelector('.file-name');
        if (fileNameDisplay) fileNameDisplay.remove();
        dropzone.querySelector('p').style.display = 'block';
        fileInput.value = '';
    }

    function handleFileUpload(e) {
        var file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            showNotification('Please upload a PDF file', 'error');
            return;
        }

        var fileNameDisplay = dropzone.querySelector('.file-name');
        if (!fileNameDisplay) {
            var p = document.createElement('p');
            p.className = 'file-name';
            p.textContent = '✅ ' + file.name;
            dropzone.appendChild(p);
        } else {
            fileNameDisplay.textContent = '✅ ' + file.name;
        }
        dropzone.querySelector('p').style.display = 'none';

        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                var arrayBuffer = event.target.result;
                var pdfData = new Uint8Array(arrayBuffer);
                var pdfjsLib = window.pdfjsLib;

                if (!pdfjsLib) {
                    resumeText = 'Resume file: ' + file.name + ' (PDF parsing library not loaded)';
                    return;
                }

                pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
                    var fullText = '';
                    var pagePromises = [];
                    for (var i = 1; i <= pdf.numPages; i++) {
                        pagePromises.push(pdf.getPage(i).then(function(page) {
                            return page.getTextContent().then(function(textContent) {
                                var strings = textContent.items.map(function(item) { return item.str; });
                                return strings.join(' ');
                            });
                        }));
                    }
                    Promise.all(pagePromises).then(function(results) {
                        fullText = results.join(' ');
                        resumeText = fullText;
                        showNotification('Resume extracted successfully!', 'success');
                    });
                }).catch(function(error) {
                    console.error('PDF parsing error:', error);
                    resumeText = 'Resume file: ' + file.name + ' (Could not parse PDF content)';
                });
            } catch (error) {
                console.error('PDF parsing error:', error);
                resumeText = 'Resume file: ' + file.name + ' (Could not parse PDF content)';
            }
        };

        reader.readAsArrayBuffer(file);
    }

    form.addEventListener('submit', handleSubmit);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearForm);
    fileInput.addEventListener('change', handleFileUpload);

    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', function() {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileUpload({ target: { files: files } });
        }
    });

    var styleEl = document.createElement('style');
    styleEl.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .notification { animation: slideIn 0.3s ease; }';
    document.head.appendChild(styleEl);

})();