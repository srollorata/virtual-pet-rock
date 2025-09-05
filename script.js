class VirtualPetRock {
    constructor() {
        this.rock = document.getElementById('petRock');
        this.statusMessage = document.getElementById('statusMessage');
        this.happinessBar = document.getElementById('happinessBar');
        this.energyBar = document.getElementById('energyBar');
        this.happinessValue = document.getElementById('happinessValue');
        this.energyValue = document.getElementById('energyValue');
        
        // Pet stats
        this.happiness = 50;
        this.energy = 50;
        this.mood = 'neutral';
        this.lastInteraction = Date.now();
        this.interactionCount = 0;
        
        // Messages for different moods
        this.messages = {
            happy: [
                "Rock is feeling great!",
                "Rock loves the attention!",
                "Rock is bouncing with joy!",
                "Rock feels so loved!",
                "Rock is having a blast!"
            ],
            annoyed: [
                "Rock is getting tired of this...",
                "Rock needs some space!",
                "Rock is rolling its eyes!",
                "Rock is getting grumpy!",
                "Rock wants to be left alone!"
            ],
            excited: [
                "Rock is super excited!",
                "Rock is bouncing around!",
                "Rock can't contain its energy!",
                "Rock is having the time of its life!",
                "Rock is absolutely thrilled!"
            ],
            tired: [
                "Rock is feeling sleepy...",
                "Rock needs some rest...",
                "Rock is getting drowsy...",
                "Rock wants to nap...",
                "Rock is running low on energy..."
            ],
            neutral: [
                "Rock is just sitting there...",
                "Rock is waiting for attention...",
                "Rock is being a rock...",
                "Rock is contemplating life...",
                "Rock is in a meditative state..."
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startIdleBehavior();
    }
    
    setupEventListeners() {
        // Rock click interaction
        this.rock.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleRockClick();
        });
        
        // Control buttons
        document.getElementById('feedBtn').addEventListener('click', () => this.feedRock());
        document.getElementById('playBtn').addEventListener('click', () => this.playWithRock());
        document.getElementById('restBtn').addEventListener('click', () => this.restRock());
        
        // Mouse movement for rolling away behavior
        this.rock.addEventListener('mouseenter', () => {
            if (this.mood === 'annoyed' && Math.random() < 0.3) {
                this.rollAway();
            }
        });
    }
    
    handleRockClick() {
        this.interactionCount++;
        this.lastInteraction = Date.now();
        
        // Determine reaction based on current mood and random chance
        const reactions = this.getPossibleReactions();
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        this.executeReaction(reaction);
        this.updateStats(reaction);
        this.updateDisplay();
    }
    
    getPossibleReactions() {
        const reactions = [];
        
        // Happy reactions (more likely when happiness is high)
        if (this.happiness > 60) {
            reactions.push('happy', 'excited');
        }
        
        // Annoyed reactions (more likely when happiness is low or too many interactions)
        if (this.happiness < 40 || this.interactionCount > 10) {
            reactions.push('annoyed');
        }
        
        // Rolling away (random chance, more likely when annoyed)
        if (this.mood === 'annoyed' && Math.random() < 0.4) {
            reactions.push('rollAway');
        }
        
        // Default reactions
        if (reactions.length === 0) {
            reactions.push('happy', 'neutral');
        }
        
        return reactions;
    }
    
    executeReaction(reaction) {
        // Remove all existing classes
        this.rock.className = 'pet-rock';
        
        switch (reaction) {
            case 'happy':
                this.rock.classList.add('happy');
                this.mood = 'happy';
                this.showMessage(this.messages.happy);
                break;
                
            case 'excited':
                this.rock.classList.add('excited');
                this.mood = 'excited';
                this.showMessage(this.messages.excited);
                break;
                
            case 'annoyed':
                this.rock.classList.add('annoyed');
                this.mood = 'annoyed';
                this.showMessage(this.messages.annoyed);
                break;
                
            case 'rollAway':
                this.rollAway();
                break;
                
            default:
                this.mood = 'neutral';
                this.showMessage(this.messages.neutral);
        }
        
        // Reset to neutral after animation
        setTimeout(() => {
            if (this.rock.classList.contains('excited')) {
                this.rock.classList.remove('excited');
            }
        }, 600);
    }
    
    rollAway() {
        this.rock.classList.add('rolling');
        this.mood = 'annoyed';
        this.showMessage("Rock is rolling away from you!");
        
        // Move rock to a random position
        const container = this.rock.parentElement;
        const maxX = container.offsetWidth - this.rock.offsetWidth;
        const maxY = container.offsetHeight - this.rock.offsetHeight;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        this.rock.style.position = 'absolute';
        this.rock.style.left = newX + 'px';
        this.rock.style.top = newY + 'px';
        
        setTimeout(() => {
            this.rock.classList.remove('rolling');
            this.rock.style.position = 'relative';
            this.rock.style.left = 'auto';
            this.rock.style.top = 'auto';
        }, 500);
    }
    
    updateStats(reaction) {
        switch (reaction) {
            case 'happy':
            case 'excited':
                this.happiness = Math.min(100, this.happiness + 10);
                this.energy = Math.max(0, this.energy - 5);
                break;
                
            case 'annoyed':
                this.happiness = Math.max(0, this.happiness - 15);
                this.energy = Math.min(100, this.energy + 5);
                break;
                
            case 'rollAway':
                this.happiness = Math.max(0, this.happiness - 20);
                this.energy = Math.min(100, this.energy + 10);
                break;
        }
    }
    
    feedRock() {
        this.happiness = Math.min(100, this.happiness + 15);
        this.energy = Math.min(100, this.energy + 20);
        this.showMessage("Rock enjoyed the meal!");
        this.updateDisplay();
    }
    
    playWithRock() {
        if (this.energy < 20) {
            this.showMessage("Rock is too tired to play...");
            return;
        }
        
        this.happiness = Math.min(100, this.happiness + 20);
        this.energy = Math.max(0, this.energy - 15);
        this.rock.classList.add('excited');
        this.showMessage("Rock loves playing with you!");
        
        setTimeout(() => {
            this.rock.classList.remove('excited');
        }, 600);
        
        this.updateDisplay();
    }
    
    restRock() {
        this.energy = Math.min(100, this.energy + 30);
        this.happiness = Math.max(0, this.happiness - 5);
        this.showMessage("Rock is resting peacefully...");
        this.updateDisplay();
    }
    
    showMessage(message) {
        this.statusMessage.textContent = message;
        this.statusMessage.style.opacity = '1';
        
        setTimeout(() => {
            this.statusMessage.style.opacity = '0.7';
        }, 2000);
    }
    
    updateDisplay() {
        this.happinessBar.style.width = this.happiness + '%';
        this.energyBar.style.width = this.energy + '%';
        this.happinessValue.textContent = this.happiness;
        this.energyValue.textContent = this.energy;
        
        // Update button states
        const playBtn = document.getElementById('playBtn');
        playBtn.disabled = this.energy < 20;
    }
    
    startIdleBehavior() {
        setInterval(() => {
            const timeSinceInteraction = Date.now() - this.lastInteraction;
            
            // Gradually decrease happiness and energy over time
            if (timeSinceInteraction > 30000) { // 30 seconds
                this.happiness = Math.max(0, this.happiness - 1);
                this.energy = Math.max(0, this.energy - 1);
                this.updateDisplay();
            }
            
            // Random idle messages
            if (timeSinceInteraction > 10000 && Math.random() < 0.1) {
                if (this.energy < 20) {
                    this.showMessage(this.messages.tired[Math.floor(Math.random() * this.messages.tired.length)]);
                } else if (this.happiness < 30) {
                    this.showMessage("Rock is feeling lonely...");
                } else {
                    this.showMessage(this.messages.neutral[Math.floor(Math.random() * this.messages.neutral.length)]);
                }
            }
        }, 5000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VirtualPetRock();
});
