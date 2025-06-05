document.addEventListener('DOMContentLoaded', function() {
    
    const gridbutton = document.querySelector("#grid");
    const listbutton = document.querySelector("#list");
    const displayArticle = document.querySelector("article");

    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching data/members.json`);
            }
            const data = await response.json();
            displayMembers(data.members);
        } catch (error) {
            console.error('Error fetching or parsing member data:', error);
            if (displayArticle) {
                displayArticle.innerHTML = '<p>Sorry, member data could not be loaded at this time. Please check if members.json is in the "data" folder and is valid JSON.</p>';
            }
        }
    }

    const displayMembers = (members) => {
        if (!displayArticle) {
            console.error("The 'article' element to display members was not found.");
            return; 
        }

        displayArticle.innerHTML = '';
        
        members.forEach(member => {
            const memberSection = document.createElement('section');
            memberSection.innerHTML = `
                <img src="${member.image}" alt="Logo of ${member.name}" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p> 
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
                <p class="membership-level">Membership: ${member.membershipLevel}</p> 
            `;
            displayArticle.appendChild(memberSection);
        });
    };

    if (gridbutton && listbutton && displayArticle) {
        gridbutton.addEventListener("click", () => {
            displayArticle.classList.add("grid");
            displayArticle.classList.remove("list");
        });

        listbutton.addEventListener("click", () => {
            displayArticle.classList.add("list");
            displayArticle.classList.remove("grid");
        });
    } else {
        console.warn("Grid/List buttons or the article display container not found. View switching might not work as expected.");
    }

    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    if (displayArticle) {
        getMembers(); 
    }
});