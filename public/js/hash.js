document.querySelectorAll('.game-button').forEach(button => {
    button.addEventListener('click', function() {
        handleGameButtonClick(this.innerText);
    });
});

const defaultSwalConfig = {
    confirmButtonColor: '#f53636',
    cancelButtonText: 'Exit',
    cancelButtonColor: '#000000',
    background: 'black',
    customClass: {
        title: 'custom-title-color',
        content: 'custom-text-color',
    }
};


function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function tryHash() {
    axios.get('/hash')
    .then(response => {
        if (response.data.blockHash && response.data.etherscanLink) {
            const winningResult = response.data.blockHash.slice(-1); // Get the last character

            // Display the result using SweetAlert2
            Swal.fire({
                ...defaultSwalConfig,
                title: 'Hash Result',
                html: `
                    <div>
                        <p><strong>Winning Result:</strong> ${winningResult}</p>
                        <p><strong>Full Hash:</strong> ${response.data.blockHash}</p>
                        <p><a href="${response.data.etherscanLink}" target="_blank">View on Etherscan</a></p>
                    </div>
                `,
                width: '60%',
                customClass: {
                    content: 'hash-result-popup-content'
                }
            });
        } else {
            console.error('Failed to retrieve the block hash.');
        }
    })
    .catch(error => {
        console.error('An error occurred while fetching the block hash:', error);
    });
}



document.addEventListener('DOMContentLoaded', function () {
        const music = document.getElementById('backgroundMusic');
        const muteButton = document.getElementById('muteButton');
        const playMusicButton = document.getElementById('playMusicButton');
    
        playMusicButton.addEventListener('click', function() {
            music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        });
        
        let clickSound = new Audio('/img/click.wav');
    
        // Add event listener to elements with the 'play-sound' class
        const soundElements = document.querySelectorAll('.play-sound');
        soundElements.forEach(element => {
            element.addEventListener('click', function() {
                clickSound.currentTime = 0;
                clickSound.play();
            });
        });
    
        muteButton.addEventListener('click', function() {
            if (music.muted) {
                music.muted = false;
                muteButton.textContent = 'Mute';
            } else {
                music.muted = true;
                muteButton.textContent = 'Unmute';
            }
        });
    
        const userWalletAddress = document.getElementById('userWalletAddress');
        
        const npcContainer = document.getElementById('npcContainer');
        npcContainer.style.display = 'none';
        const closeNpcButton = document.getElementById('closeNpc');
        const mainContainer = document.querySelector('.main-container');

        mainContainer.style.opacity = '0.2';
        mainContainer.style.pointerEvents = 'none';
    
        closeNpcButton.addEventListener('click', function() {
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
        });
        
        bubbleClicked();
});


function bubbleClicked() {
    // Start the first message
    firstMessage();
    const npcContainer = document.getElementById('npcContainer');
    const mainContainer = document.querySelector('.main-container');
    
    npcContainer.style.display = 'block';
    mainContainer.style.opacity = '0.2';
    mainContainer.style.pointerEvents = 'auto';
}


function firstMessage() {
    let closeSound = new Audio('/img/close.wav');
    
    Swal.fire({
        width: '40%',
        title: 'Are You Whitelisted?',
        text: 'Ahoy, young traveler! Im pleased to see familiar faces sticking around. Have you secured your position on the whitelist yet? Our vessel can only carry so many, and the seats are filling up fast. You might need to dig deep and rely on more than just luck to get a spot aboard.',
        imageUrl: '/img/boat/Quest_info_1.png?v1',
        imageAlt: 'EV3 Hunt',
        showCancelButton: true,
        confirmButtonText: 'Next',
        confirmButtonColor: '#f53636',
        cancelButtonText: 'Exit',
        cancelButtonColor: '#000000',
        background: 'black',
        customClass: {
            title: 'custom-title-color',
            htmlContainer: 'custom-text-color',
        },
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            secondMessage();
        } else if (result.isDismissed) {
            // This will run when the "Exit" button is clicked
            closeSound.play();
            const npcContainer = document.getElementById('npcContainer');
            const mainContainer = document.querySelector('.main-container');
            
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
            const music = document.getElementById('backgroundMusic');
            music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        }
    });
}

function secondMessage() {
    let closeSound = new Audio('/img/close.wav');
    Swal.fire({
        width: '40%',
        title: 'Feel Like A Winner',
        text: 'If you re looking to earn your way to a ticket, there is a little gaming spot on the island. Many have tried their hand and walked away with a pocketful of coins. Who knows? With enough coins, you could buy yourself a ticket and join us on our journey',
        imageUrl: '/img/boat/Quest_info_2.png?v2',
        imageAlt: 'Rewards',
        showCancelButton: true,
        confirmButtonText: 'Next',
        confirmButtonColor: '#f53636',
        cancelButtonText: 'Exit',
        cancelButtonColor: '#000000',
        background: 'black',
        customClass: {
            title: 'custom-title-color',
            htmlContainer: 'custom-text-color',
        },
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            thirdMessage();
        } else if (result.isDismissed) {
            // This will run when the "Exit" button is clicked
            closeSound.play();
            const npcContainer = document.getElementById('npcContainer');
            const mainContainer = document.querySelector('.main-container');
            
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
            const music = document.getElementById('backgroundMusic');
            music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        }
    });
}

function thirdMessage() {
    let closeSound = new Audio('/img/close.wav');
    Swal.fire({
        width: '40%',
        title: 'Island’s Friendly Neighborhood',
        text: 'While you are wandering the island, dont forget to visit the local shops. Befriend the shopkeepers; they have their ears to the ground. Some of them might know a way to get a scalper tickets. It is always about who you know in places like this!',
        imageUrl: '/img/boat/Quest_info_3.png?v1',
        imageAlt: 'Clicking Life',
        showCancelButton: true,
        confirmButtonText: 'Next',
        confirmButtonColor: '#f53636',
        cancelButtonText: 'Exit',
        cancelButtonColor: '#000000',
        background: 'black',
        customClass: {
            title: 'custom-title-color',
            htmlContainer: 'custom-text-color',
        },
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            fourthMessage();
        } else if (result.isDismissed) {
            // This will run when the "Exit" button is clicked
            closeSound.play();
            const npcContainer = document.getElementById('npcContainer');
            const mainContainer = document.querySelector('.main-container');
            
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
            
            const music = document.getElementById('backgroundMusic');
            music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        }
    });
}

function fourthMessage() {
    let closeSound = new Audio('/img/close.wav');
    Swal.fire({
        width: '40%',
        title: 'Whispers of the Wind',
        text: 'If you have managed to get your ticket, A hearty congratulations to you! While we wait for the others to join, why not explore the island? Theres plenty to see and experience here.',
        imageUrl: '/img/bluecode.png?v1',
        imageAlt: 'EV3 Blue Code',
        confirmButtonText: 'Ahoy!',
        confirmButtonColor: '#f53636',
        background: 'black',
        customClass: {
            title: 'custom-title-color',
            htmlContainer: 'custom-text-color',
        },
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // This will run when the "Exit" button is clicked
            closeSound.play();
            const npcContainer = document.getElementById('npcContainer');
            const mainContainer = document.querySelector('.main-container');
            
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
            
            const music = document.getElementById('backgroundMusic');
            music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        }
    });
}

function showClickedUsers() {
    axios.get('/clicked-users')
    .then(response => {
        const users = response.data;
        let userList = '<table style="width:100%; border-collapse: collapse;">';
        userList += '<thead><tr><th style="border: 1px solid #575757; padding: 8px;">Name</th><th style="border: 1px solid #575757; padding: 8px;">Wallet Address</th></tr></thead><tbody>';
        
        users.forEach(user => {
            const userName = user ? user.name : 'NULL';
            const userWalletAddress = user && user.wallet_address ? user.wallet_address : 'NULL';

            userList += '<tr>';
            userList += '<td style="border: 1px solid #575757; padding: 8px;">' + userName + '</td>';
            userList += '<td style="border: 1px solid #575757; padding: 8px;">' + userWalletAddress + '</td>';
            userList += '</tr>';
        });
        
        userList += '</tbody></table>';

        Swal.fire({
            confirmButtonText: 'Ahoy!',
            confirmButtonColor: '#f53636',
            background: 'black',
            customClass: {
                title: 'custom-title-color',
                htmlContainer: 'custom-text-color custom-text-font',
            },
            title: 'Whitelisted',
            html: userList,
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function showRewardUsers() {
    axios.get('/reward-users')
    .then(response => {
        const users = response.data;
        let userList = '<table style="width:100%; border-collapse: collapse;">';
        userList += '<thead><tr><th style="border: 1px solid #575757; padding: 8px;">Name</th></tr></thead><tbody>';
        
        users.forEach(user => {
            userList += '<tr>';
            userList += '<td style="border: 1px solid #575757; padding: 8px;">' + user.name + '</td>';
            userList += '</tr>';
        });
        
        userList += '</tbody></table>';

        Swal.fire({
            confirmButtonText: 'Ahoy!',
            confirmButtonColor: '#f53636',
            background: 'black',
            customClass: {
                title: 'custom-title-color',
                htmlContainer: 'custom-text-color custom-text-font',
            },
            title: 'Special Prize Hall',
            html: userList,
        });
    })
    .catch(error => {
        console.error('Error fetching reward users:', error);
    });
}


const walletPopoutButton = document.getElementById('walletPopoutButton');
if (walletPopoutButton) {
    walletPopoutButton.addEventListener('click', function() {
        checkUserForPopout();
    });
}

function checkUserForPopout() {
    axios.get('/cash')
    .then(response => {
        if (response.data.showPopout) {
            if (response.data.hasWalletAddress) {
                Swal.fire({
                    title: 'Your Wallet Address',
                    text: response.data.walletAddress,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f53636',
                    background: 'black',
                    customClass: {
                        title: 'custom-title-color',
                        htmlContainer: 'custom-text-color',
                    },
                });
            } else {
                // Show popout to input wallet address
                Swal.fire({
                    title: 'ERC20 Wallet Address',
                    input: 'text',
                    inputPlaceholder: 'Enter your wallet address for $5',
                    confirmButtonText: 'Submit',
                    confirmButtonColor: '#f53636',
                    background: 'black',
                    customClass: {
                        title: 'custom-title-color',
                        htmlContainer: 'custom-text-color',
                    },
                    showCancelButton: true,

                }).then(result => {
                    if (result.isConfirmed) {
                        axios.post('/wallet', {
                            wallet_address: result.value
                        }).then(response => {
                            // Handle success
                            Swal.fire({
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#f53636',
                                background: 'black',
                                customClass: {
                                    title: 'custom-title-color',
                                    htmlContainer: 'custom-text-color',
                                },
                                icon: 'success',
                                title: 'Success!',
                                text: 'Wallet address saved successfully!'
                            });
                        }).catch(error => {
                            if (error.response && error.response.data) {
                                Swal.fire({
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#f53636',
                                    background: 'black',
                                    customClass: {
                                        title: 'custom-title-color',
                                        htmlContainer: 'custom-text-color',
                                    },
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: error.response.data.message || 'Something went wrong!'
                                });
                            } else {
                                Swal.fire({
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#f53636',
                                    background: 'black',
                                    customClass: {
                                        title: 'custom-title-color',
                                        htmlContainer: 'custom-text-color',
                                    },
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Something went wrong!'
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}

document.querySelector('.clickable-object').addEventListener('click', function() {
    updateEntries(function(entries) {
        const music = document.getElementById('backgroundMusic');
        Swal.fire({
            ...defaultSwalConfig,
            title: 'PLACE YOUR BET',
            customClass: {
                popup: 'custom-swal'
            },
            html: `
                <div class="game-buttons-container">
                    ${[...Array(10).keys()].map(number => `<button id="btn${number}" class="game-button">${number}</button>`).join('')}
                    ${['A', 'B', 'C', 'D', 'E', 'F'].map(letter => `<button id="btn${letter}" class="game-button">${letter}</button>`).join('')}
                </div>
                <div class="user-entries">
                    <h3 style="color:white">Pending Entries</h3>
                    ${entries.length === 0 ? "<p>You haven't made any entries yet.</p>" : `
                        <table>
                            <thead>
                                <tr>
                                    <th>Entry Value</th>
                                    <th>Result</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entries.filter(entry => entry.result === "pending").map(entry => `
                                    <tr>
                                        <td>${entry.entry_value}</td>
                                        <td>${entry.actual_result ? `<a href="${entry.hash_link}" target="_blank">${entry.actual_result.substr(-1)}</a>` : 'N/A'}</td>
                                        <td>${entry.result}</td>
                                        <td>${new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            `,
            width: '800px',
            showCloseButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            focusConfirm: false,
            didOpen: () => {
                const clickMusic = document.getElementById('clickMusic');
                clickMusic.play();
                music.pause();

                const buttons = document.querySelectorAll('.game-button');
                let currentIndex = 0;
                
                function glowButton() {
                    if (currentIndex > 0) {
                        buttons[currentIndex - 1].classList.remove('glowing-effect');
                    } else {
                        buttons[buttons.length - 1].classList.remove('glowing-effect');
                    }
                
                    buttons[currentIndex].classList.add('glowing-effect');
                
                    currentIndex++;
                
                    if (currentIndex >= buttons.length) {
                        currentIndex = 0;
                    }
                
                    setTimeout(glowButton, 500);
                }
                
                glowButton();
                
                buttons.forEach(button => {
                    button.addEventListener('click', function() {
                        handleGameButtonClick(this.innerText);
                    });
                });

            },
            didClose: () => {
                const clickMusic = document.getElementById('clickMusic');
                clickMusic.pause();
                music.play();
            }

        });
    });
});

function updateEntries(callback, updateModal = false) {
    axios.get('/get-user-entries')
    .then(response => {
        const entries = response.data;
        console.log(entries); // Log the entries here
        callback(entries);
        if (updateModal) {
            const userEntriesDiv = document.querySelector('.user-entries');
            userEntriesDiv.innerHTML = `
                <h3>Your Entries</h3>
                ${entries.length === 0 ? "<p>You haven't made any entries yet.</p>" : `
                    <table>
                        <thead>
                            <tr>
                                <th>Entry Value</th>
                                <th>Result</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${entries.map(entry => `
                                <tr>
                                    <td>${entry.entry_value}</td>
                                    <td>${entry.actual_result ? `<a href="${entry.hash_link}" target="_blank">${entry.actual_result.substr(-1)}</a>` : 'N/A'}</td>
                                    <td>${entry.result}</td>
                                    <td>${new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            `;
        }
    })
}

function handleGameButtonClick(buttonValue) {
    fetch('/hit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ buttonValue: buttonValue })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            ...defaultSwalConfig,
            title: data.message,
            icon: data.status,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        if (data.status === 'success') {
            const remainingClicksDiv = document.getElementById('remainingClicksDiv');
            remainingClicksDiv.textContent = `You have ${data.remainingClicks} clicks left for today.`;
            updateEntries(() => {}, true); 
        }
        
        setTimeout(() => {
            document.querySelector('.clickable-object').click();
        }, 500);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

let currentPage = 1;

document.querySelector('#previousResultsButton').addEventListener('click', function() {
    fetchPastHashes(currentPage);
});

function fetchPastHashes(page) {
    axios.get('/past-hashes?page=' + page)
    .then(response => {
        const data = response.data;
        const pastHashes = data.data; // The actual data is inside the 'data' property

        var pastHashesHtml = pastHashes.map(function(hash) {
            return `
                <tr>
                    <td>${hash.hash.slice(-1)}</td>
                    <td><a href="${hash.link}" target="_blank">${hash.hash}</a></td>
                    <td>${hash.retrieved_at}</td>
                </tr>
            `;
        }).join('');

        Swal.fire({
            ...defaultSwalConfig,
            title: 'Previous Results',
            html: `
                <table>
                    <thead>
                        <tr>
                            <th>Result</th>
                            <th>Full Hash</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pastHashesHtml}
                    </tbody>
                </table>
                <div class="pagination" style="margin-top:15px">
                    <button ${data.prev_page_url ? '' : 'disabled'} onclick="fetchPastHashes(${data.current_page - 1})">Previous</button>
                    <button ${data.next_page_url ? '' : 'disabled'} onclick="fetchPastHashes(${data.current_page + 1})">Next</button>
                </div>
            `,
            width: '40%',
        });
    });
}

function getTimeRemaining() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    return nextHour - now;
}


// Update the countdown display
function updateCountdownDisplay(duration) {
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    document.getElementById('countdown').textContent = `Next Result: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Start the countdown
function startCountdown() {
    let duration = getTimeRemaining();
    updateCountdownDisplay(duration);
    const interval = setInterval(() => {
        duration -= 1000;
        updateCountdownDisplay(duration);
        if (duration <= 0) {
            clearInterval(interval);
            tryHash();
            setTimeout(startCountdown, 1000); // Restart the countdown after a second
        }
    }, 1000);
}

startCountdown();

document.getElementById('shopButton').addEventListener('click', function() {
    axios.all([
        axios.get('/shop-items'),
        axios.get('/user-info')
    ])
    .then(axios.spread((shopResponse, userResponse) => {
        const items = shopResponse.data;
        const userPoints = userResponse.data.points; // Assuming the endpoint returns an object with a 'points' property
    
        let itemsHtml = `
            <p id="pointsDisplay" style="color:white">Your Coins: ${userPoints}</p>
            <table class="shop-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Cost</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                            <td>${item.name}</td>
                            <td class="description-cell">${item.description}</td>
                            <td>${item.cost} coins</td>
                            <td><button onclick="purchaseItem(${item.id})">Purchase</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        Swal.fire({
            ...defaultSwalConfig,
            width: '60%',
            title: 'Not Secret Shop',
            html: itemsHtml,
        });
    }));
});

document.getElementById('stone').addEventListener('click', function() {
    let stoneSound = new Audio('/img/boat/stone.wav');
    stoneSound.play();
      Swal.fire({
        ...defaultSwalConfig,
        title: 'Midas Stone',
        text: "Congratulations, brave adventurer! You've discovered the legendary Midas Stone, hidden away in the depths of the ancient ruins. Here, you have the opportunity to spend 5 of your hard-earned coins for a chance to turn ordinary objects into gleaming gold! Will you take the risk and test the stone's mythical powers?",
        imageUrl: '/img/boat/Quest_midas_1.png',
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: 'Quest Midas 1',
        showCancelButton: true,
        confirmButtonText: 'Spend 5 coins',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/stone', {})
          .then(response => {
            const data = response.data;
            if (data.status === 'success') {
                document.getElementById('userPointsDiv').textContent = 'Your Coins: ' + data.updatedPoints;
                document.getElementById('userGoldsDiv').textContent = 'Your Coins: ' + data.updatedGolds;
    
              if (data.message === 'Congratulations! You have won a special reward!') {
                Swal.fire({
                    ...defaultSwalConfig,
                  title: 'Victory!',
                  text: 'Fortune smiles upon you! You have unearthed a rare and valuable treasure!',
                  //icon: 'success',
                  imageUrl: '/img/boat/Quest_midas_4.png',
                  imageWidth: 400,
                  imageHeight: 400,
                  imageAlt: 'Quest Midas 1',
                });
              } else {
                Swal.fire({
                    ...defaultSwalConfig,
                  title: 'Boomblek!',
                  text: 'The fates have not favored you this time. The treasure remains elusive.',
                  //icon: 'error',
                  imageUrl: '/img/boat/Quest_midas_2.png',
                  imageWidth: 400,
                  imageHeight: 400,
                  imageAlt: 'Quest Midas 1',
                });
              }
            } else {
              Swal.fire({
                  ...defaultSwalConfig,
                title: 'Curses!',
                text: 'A dark cloud has cast its shadow upon your quest. ' + data.message,
                //icon: 'error',
                imageUrl: '/img/boat/Quest_midas_3.png',
                imageWidth: 400,
                imageHeight: 400,
                imageAlt: 'Quest Midas 1',
              });
            }
          })
          .catch(error => {
            console.error('Beware:', error);
            Swal.fire({
                ...defaultSwalConfig,
              title: 'Peril!',
              text: 'A mysterious force has interfered with your quest. Please gather your courage and try again later.',
              //icon: 'error',
              imageUrl: '/img/boat/Quest_midas_3.png',
              imageWidth: 400,
              imageHeight: 400,
              imageAlt: 'Quest Midas 1',
            });
          });
        }
      });
});





function purchaseItem(itemId) {
    let winSound = new Audio('/img/win.wav');
    axios.post('/purchase-item', { item_id: itemId })
    .then(response => {
        if (response.data.status === 'success') {
            alert(response.data.message);
            
            if (itemId === 1) {
                const updatedClicks = response.data.updatedClicks;
                document.getElementById('remainingClicksDiv').textContent = `You have ${updatedClicks} clicks left for today.`;
            }
            
            if (itemId === 3) {
                const twitterShareUrl = `https://twitter.com/intent/tweet?text=Behold%2C%20I%20have%20secured%20my%20golden%20ticket%20to%20the%20mystical%20realm%20of%20EV3%2C%20where%20treasures%20and%20special%20raffle%20prizes%20await%20the%20bravest%20adventurers%21%20Will%20you%20join%20me%20on%20this%20epic%20quest%3F%20%23EV3%20%23BLUECODE&url=https://boat.ev3nft.xyz/`;
                winSound.play();
                (async () => {
                    const userWinStatus = await checkUserWinStatus(window.userId);
                    let message, icon, imageUrl, rewardReceived = false;
            
                    if (!userWinStatus) {
                        message = 'Your ID is already registered in the database, and we will notice you on game day.';
                        icon = 'info';
                    } else {
                        message = 'Congratulations! You found a special reward! You have secured a ticket for the grand raffle, granting you a chance to win any of the items listed above! We have noted your entry. You dont need to do anything further for now. Continue your search for the whitelist!';
                        icon = 'success';
                        imageUrl = '/img/special2.png';
                        winSound.play();
                        rewardReceived = true;
                    }
            
                    console.log("Logging user_id:", window.userId);
                    // console.log("Logging number:", rewardChance); // rewardChance is not defined in the provided code
            
                    if (rewardReceived) {
                        axios.post('/recordReward', {
                            user_id: window.userId,
                            reward_type: "special",
                        })
                        .then(response => {
                            if (response.data.success) {
                                console.log("Reward recorded successfully!");
                            } else {
                                console.error("Failed to record the reward.");
                            }
                        })
                        .catch(error => {
                            console.error("Error recording the reward:", error);
                        });
            
                        Swal.fire({
                            title: 'Flying Code',
                            text: message,
                            imageUrl: imageUrl,
                            background: 'black',
                            showConfirmButton: false,
                            customClass: {
                                title: 'custom-title-color',
                                htmlContainer: 'custom-text-color',
                            },
                            html: `
                                Congratulations! You found a special reward! You have secured a ticket for the grand raffle, granting you a chance to win any of the items listed above! We have noted your entry. You don't need to do anything further for now. Continue your search for the whitelist!
                                <br><br>
                                <a href="${twitterShareUrl}" target="_blank">
                                    <button class="swal2-confirm swal2-styled" style="background-color: red;">Share</button>
                                </a>`
                        });
                    }
                })();
            }

            const updatedPoints = response.data.updatedPoints;
            document.getElementById('userPointsDiv').textContent = `Your Coins: ${updatedPoints}`;
            document.getElementById('pointsDisplay').textContent = `Your Coins: ${updatedPoints}`; // Update the points display
            
            if (response.data.item_id == 2) {
                const twitterShareUrl = `https://twitter.com/intent/tweet?text=Lo%20and%20behold%2C%20I%20have%20in%20my%20possession%20the%20coveted%20whitelist%20pass%20to%20the%20enchanted%20lands%20of%20EV3%21%20This%20magical%20pass%20is%20my%20key%20to%20unlocking%20a%20world%20filled%20with%20wonders%20and%20treasures%20untold.%20Will%20you%20join%20me%20on%20this%20grand%20adventure%3F%20%23EV3%20%23BLUECODE&url=https://boat.ev3nft.xyz/`;
                winSound.play();
                let swalConfig = {
                    ...defaultSwalConfig,
                    title: 'Whitelist Ticket',
                    text: 'Congratulations on securing your ticket to EV3! Welcome aboard the boat. Feel free to explore the island while waiting, search for hidden treasures, or participate in our raffle.',
                    input: 'text',
                    inputPlaceholder: 'Enter your wallet address',
                    showCancelButton: false,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    preConfirm: (walletAddress) => {
                        return axios.post('/wallet', { wallet_address: walletAddress })
                        .then(response => {
                            if (!response.data.success) {
                                throw new Error(response.data.message);
                            }
                            return response.data;
                        })
                        .catch(error => {
                            Swal.showValidationMessage(`Request failed: ${error}`);
                        });
                    },
                };
            
                Swal.fire(swalConfig).then((result) => {
                    if (result.value) {
                        Swal.fire({
                            ...defaultSwalConfig,
                            title: 'Saved!',
                            text: 'Your wallet address has been saved.',
                            icon: 'success',
                            showConfirmButton: false,
                            html: `
                                <br><br>
                                <a href="${twitterShareUrl}" target="_blank">
                                    <button class="swal2-confirm swal2-styled" style="background-color: black;">Share on Twitter</button>
                                </a>`
                        }).then(() => {
                            
                        });
                    }
                });
            }
        } else {
            Swal.fire({
                ...defaultSwalConfig,
                title: 'Error',
                text: response.data.message,
                icon: 'error'
            });
        }
    });
}

document.getElementById('showAllEntriesButton').addEventListener('click', function() {
    showAllEntries(1); // Start with the first page
});

function showAllEntries(page) {
    axios.get('/get-all-entries', {
        params: {
            page: page
        }
    })
    .then(response => {
        console.log(response.data);
        const entries = response.data.data;
        const currentPage = response.data.current_page;
        const lastPage = response.data.last_page;

        Swal.fire({
            ...defaultSwalConfig,
            title: 'Entries History',
            width: '40%',
            html: `
                <div class="all-entries">
                    <table>
                        <thead>
                            <tr>
                                <th>Entry Value</th>
                                <th>Result</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${entries.map(entry => `
                                <tr>
                                    <td>${entry.entry_value}</td>
                                    <td>${entry.block_hash && entry.block_hash.hash ? `<a href="${entry.block_hash.link}" target="_blank">${entry.block_hash.hash.substr(-1)}</a>` : 'N/A'}</td>
                                    <td>${entry.result}</td>
                                    <td>${new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            `).join('')}
                        </tbody>

                    </table>
                </div>
                <div class="pagination-controls" style="margin-top:15px">
                    <button id="prevPage" ${currentPage <= 1 ? 'disabled' : ''} onclick="showAllEntries(${currentPage - 1})">Previous</button>
                    <span>Page ${currentPage} of ${lastPage}</span>
                    <button id="nextPage" ${currentPage >= lastPage ? 'disabled' : ''} onclick="showAllEntries(${currentPage + 1})">Next</button>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            focusConfirm: false
        });
    });
}

function checkUserWinStatus(userId) {
    return axios.get(`/checkWinStatus`, {
        params: {
            user_id: userId
        }
    })
    .then(response => {
        console.log("User win status response:", response.data);  // Logging the response
        return response.data;
    })
    .catch(error => {
        console.error("Error checking user win status:", error);
    });
}
