console.log("Email Writer Assistant Extension Loaded");

function createAIbutton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI reply');
    return button;
}

function getEmailContent() {
        const selectors = [
        '.h7', // Gmail compose button
        '.a3s.ail', // Gmail send button
        '.gmail_quote', // Gmail quote
        '[role="presentation"]'// Generic toolbar
         
    ];
    for(const selector of selectors) {
       const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
    }
    return '';
}
}

function findComposeToolbar() {
        const selectors = [
        '.aDh', // Gmail compose button
        '.btC', // Gmail send button
        '[role="toolbar"]', // Generic toolbar
         '.gU.Up'
    ];
    for(const selector of selectors) {
       const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
    }
    return null;
}
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton)
        existingButton.remove();
    
    const toolbar=findComposeToolbar();
    if (!toolbar) {
        console.log("Compose toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button = createAIbutton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click', async() => {
       try {
        button.innerHTML = 'Generating...';
        button.disabled = true;
        const emailContent = getEmailContent();
        const response =await fetch('http://localhost:8080/api/generateReply', {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({ emailContent: emailContent,
                tone : 'friendly'
             })

       });
        if (!response.ok) {
            throw new Error('API request failed with status ' + response.status);
        }
        const generateReply = await response.text();
        const composeBox = document.querySelector(' [role="textbox"][g_editable="true"]');
        if (composeBox) {
            composeBox.focus();
            document.execCommand('insertText', false, generateReply);
        } else{
            console.error("Compose box not found");
        }
    } catch (error) {
        console.error(error);
        alert("Error generating reply:", error);
       } finally {
        button.innerHTML = 'AI reply';
        button.disabled = false;
    }
        
});
    toolbar.insertBefore(button, toolbar.firstChild);
}
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElement = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches('.aDh, .btC, [role="dialog"]') ||
                node.querySelector('.aDh, .btC, [role="dialog"]')
            )
        );
        if (hasComposeElement) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
})
