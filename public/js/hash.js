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
        /*const closeNpcButton = document.getElementById('closeNpc');
        const mainContainer = document.querySelector('.main-container');

        mainContainer.style.opacity = '0.2';
        mainContainer.style.pointerEvents = 'none';
    
        closeNpcButton.addEventListener('click', function() {
            npcContainer.style.display = 'none';
            mainContainer.style.opacity = '1';
            mainContainer.style.pointerEvents = 'auto';
        });
        
        bubbleClicked();*/
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
        title: 'Treasure Hunt',
        text: 'Ahoy, adventurer! Welcome to the Island Treasure Hunt. Set your sights on our vast 50 x 50 grid and brace yourself for a journey like no other.',
        imageUrl: '/img/whitelist.png?v1',
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
            //music.play();
            playMusicButton.style.display = 'none'; // Hide the play button after clicking
            muteButton.style.display = 'block';
        }
    });
}

function secondMessage() {
    let closeSound = new Audio('/img/close.wav');
    Swal.fire({
        title: 'Island Secrets',
        text: 'Within this expansive realm, the unexpected awaits you. Some squares might hide coveted whitelist spots, while others guard hidden treasures or elusive tickets. And sometimes, the grid may just test your patience with an empty spot, leaving your fate in the hands of luck.',
        imageUrl: '/img/reward.png?v1',
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
        title: 'The Island’s Generosity',
        text: 'By connecting with your Twitter, the island grants you the power of 2 clicks each day. As the clock resets at GMT+8 00:00, so do your chances. And if you ever find yourself eager for just one more chance, spread word of our land on Twitter, and an additional click shall be bestowed upon you.',
        imageUrl: '/img/twittershare.png?v1',
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
        title: 'Whispers of the Wind',
        text: 'Always be on your guard, adventurer. The winds whisper of surprise events that might come your way. Our islands story unfolds on Twitter, so stay close and listen well. So, are you ready to test your mettle and seek out the treasures that await? The Island beckons! 🏝🔍🎁',
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
        Swal.fire({
            //...defaultSwalConfig,
            title: 'Choose Number',
            customClass: {
        popup: 'custom-swal'
    },
            html: `
                <div class="game-buttons-container">
                    ${[...Array(10).keys()].map(number => `<button id="btn${number}" class="game-button">${number}</button>`).join('')}
                    ${['A', 'B', 'C', 'D', 'E'].map(letter => `<button id="btn${letter}" class="game-button">${letter}</button>`).join('')}
                </div>
                <div class="user-entries">
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
            width: '60%',
            showCloseButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            focusConfirm: false,
            didOpen: () => { 
                document.querySelectorAll('.game-button').forEach(button => {
                    button.addEventListener('click', function() {
                        handleGameButtonClick(this.innerText);
                    });
                });
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
                <div class="pagination">
                    <button ${data.prev_page_url ? '' : 'disabled'} onclick="fetchPastHashes(${data.current_page - 1})">Previous</button>
                    <button ${data.next_page_url ? '' : 'disabled'} onclick="fetchPastHashes(${data.current_page + 1})">Next</button>
                </div>
            `,
            width: '60%',
        });
    });
}

/*function getTimeRemaining() {
    const now = new Date();
    const nextMinute = new Date(now);
    nextMinute.setMinutes(now.getMinutes() + 1);
    nextMinute.setSeconds(0);
    return nextMinute - now;
}*/

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
            <p id="pointsDisplay">Your Total Points: ${userPoints}</p>
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
                            <td>${item.description}</td>
                            <td>${item.cost} points</td>
                            <td><button onclick="purchaseItem(${item.id})">Purchase</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        Swal.fire({
            ...defaultSwalConfig,
            title: 'Shop Items',
            html: itemsHtml,
            width: '80%',
        });
    }));
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
            
            const updatedPoints = response.data.updatedPoints;
            document.getElementById('userPointsDiv').textContent = `Your Total Points: ${updatedPoints}`;
            document.getElementById('pointsDisplay').textContent = `Your Total Points: ${updatedPoints}`; // Update the points display
            
            if (response.data.item_id == 2) {
                const twitterShareUrl = `https://twitter.com/intent/tweet?text=I%20got%20my%20adventure%20ticket%20to%20EV3%20!%20%23EV3%20%23BLUECODE&url=https://boat.ev3nft.xyz/`;
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
            // Display the server's error message using Swal.fire
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
        const entries = response.data.data;
        const currentPage = response.data.current_page;
        const lastPage = response.data.last_page;

        Swal.fire({
            ...defaultSwalConfig,
            title: 'All Entries',
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
                                    <td>${entry.actual_result ? `<a href="${entry.hash_link}" target="_blank">${entry.actual_result.substr(-1)}</a>` : 'N/A'}</td>
                                    <td>${entry.result}</td>
                                    <td>${new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="pagination-controls">
                    <button id="prevPage" ${currentPage <= 1 ? 'disabled' : ''} onclick="showAllEntries(${currentPage - 1})">Previous</button>
                    <span>Page ${currentPage} of ${lastPage}</span>
                    <button id="nextPage" ${currentPage >= lastPage ? 'disabled' : ''} onclick="showAllEntries(${currentPage + 1})">Next</button>
                </div>
            `,
            width: '80%',
            showCloseButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            focusConfirm: false
        });
    });
}


