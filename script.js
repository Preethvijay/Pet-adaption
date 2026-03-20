// script.js
// Modern, realistic pet data using high-quality Unsplash URLs
const pets = [
    { id: 1, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 2, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Luna', type: 'Cat', breed: 'British Shorthair', age: 1, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Max', type: 'Dog', breed: 'German Shepherd', age: 3, image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Milo', type: 'Cat', breed: 'Maine Coon', age: 4, image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Daisy', type: 'Dog', breed: 'Beagle', age: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Oliver', type: 'Cat', breed: 'Scottish Fold', age: 2, image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
];

let displayedPets = [];
let currentIndex = 0;
const petsPerLoad = 3;

// Function to scroll to a section smoothly
window.scrollToSection = function(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Populate pets grid with glassmorphism cards and smooth entrance
window.populatePets = function() {
    const grid = document.getElementById('petsGrid');
    const petsToShow = pets.slice(currentIndex, currentIndex + petsPerLoad);
    
    petsToShow.forEach((pet, index) => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        // Add staggered animation delay
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`;
        card.style.opacity = '0';
        
        card.innerHTML = `
            <div class="pet-image-container">
                <img src="${pet.image}" alt="${pet.name}" loading="lazy">
            </div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <div class="pet-details">
                    <p><i class="ph ph-paw-print"></i> ${pet.breed}</p>
                    <p><i class="ph ph-calendar-blank"></i> ${pet.age} years old</p>
                </div>
                <button class="btn-primary" onclick="selectPet(${pet.id})">
                    Adopt ${pet.name} <i class="ph ph-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
        displayedPets.push(pet);
    });
    
    currentIndex += petsPerLoad;

    // Hide load more button if all pets are shown
    if (currentIndex >= pets.length) {
        const btn = document.querySelector('.load-more');
        if (btn) btn.style.display = 'none';
    }

    // Populate adopt form select
    updateSelectOptions();
}

function updateSelectOptions() {
    const select = document.getElementById('petSelect');
    // Keep current selection if any
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Select a Pet</option>';
    // We add all pets to the dropdown, not just displayed ones, for better UX
    pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = `${pet.name} (${pet.breed})`;
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

// Load more pets
window.loadMorePets = function() {
    if (currentIndex < pets.length) {
        populatePets();
    }
}

// Select pet for adoption and scroll to form
window.selectPet = function(petId) {
    const select = document.getElementById('petSelect');
    select.value = petId;
    
    // Slight delay to allow UI to register before scroll
    setTimeout(() => {
        scrollToSection('adopt');
        // Optional: flash the select input to draw attention
        select.style.boxShadow = '0 0 0 4px rgba(193, 18, 31, 0.4)';
        setTimeout(() => {
            select.style.boxShadow = '';
        }, 1000);
    }, 100);
}

// Handle adopt form submission with modern alert/notification
window.handleAdopt = function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedPetId = document.getElementById('petSelect').value;
    
    if (selectedPetId) {
        const selectedPet = pets.find(pet => pet.id == selectedPetId);
        
        // Change button state to show processing
        const btn = event.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="ph ph-spinner ph-spin"></i>';
        
        // Simulate network request
        setTimeout(() => {
            alert(`🎉 Success! Thank you for your interest in adopting ${selectedPet.name}!\nWe'll contact you soon at ${formData.get('email')}.`);
            event.target.reset();
            document.getElementById('petSelect').value = '';
            btn.innerHTML = originalText;
        }, 1000);
        
    } else {
        alert('Please select a pet to adopt.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populatePets();
    updateSelectOptions();
    
    // Add scroll listener for revealing elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
});