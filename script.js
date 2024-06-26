document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function () {
        const passportNo = document.getElementById('passportInput').value.trim();
        const resultDiv = document.getElementById('result');
        
        resultDiv.innerText = '';
        resultDiv.classList.remove('error');

        if (passportNo === '') {
            resultDiv.innerText = 'Error: Passport number is required';
            resultDiv.classList.add('error');
        } else {
            fetchDummyPassportData(passportNo);
        }
    });
});

function fetchDummyPassportData(passportNo) {

    setTimeout(() => {

        const simulatedApiResponse = {
            dob: "01-02-1999",
            birthCountry: "India",
            dateofissue: "20-02-2022",
            expireDate: "20-02-2022",
            birthPlace: "Mumbai",
            fname: "AZAD",
            lname: "RATHORE",
            fathername: "SINGH",
            mothername: "KOKILA",
            passportissueplace: "",
            gender: "1",
            presentNationality: "",
            adhaarno: ""
        };

        const resultDiv = document.getElementById('result');
        resultDiv.classList.remove('error');

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {


            // Function to handle the response from content script
            const handleResponse = (response) => {
                const resultDiv = document.getElementById('result');
                if (chrome.runtime.lastError) {
                    console.error('Runtime error:', chrome.runtime.lastError.message);  // Debug log
                    resultDiv.innerText = `Error: ${chrome.runtime.lastError.message}`;
                    resultDiv.classList.add('error');
                } else if (!response) {
                    console.error('Error: No response received');  // Debug log
                    resultDiv.innerText = 'Error: No response received';
                    resultDiv.classList.add('error');
                } else if (response.status === "success") {
                    console.log('Field updated successfully');  // Debug log
                } else {
                    console.log('Error updating field:', response.message);  // Debug log
                    resultDiv.innerText = `Error: ${response.message}`;
                    resultDiv.classList.add('error');
                }
            };

            // Function to send message
            const sendMessage = (action, data) => {
                chrome.tabs.sendMessage(tabs[0].id, { action, data }, handleResponse);
            };

            console.log('Sending messages to content script');  // Debug log

            // Send messages to update fields
            sendMessage("presentNationality", { presentNationality: simulatedApiResponse.presentNationality });
            sendMessage("dob", { dob: simulatedApiResponse.dob });
            sendMessage("birthCountry", { birthCountry: simulatedApiResponse.birthCountry });
            sendMessage("dateofissue", { dateofissue: simulatedApiResponse.dateofissue });
            sendMessage("expireDate", { expireDate: simulatedApiResponse.expireDate });
            sendMessage("birthPlace", { birthPlace: simulatedApiResponse.birthPlace });
            sendMessage("fname", { fname: simulatedApiResponse.fname });
            sendMessage("lname", { lname: simulatedApiResponse.lname });
            sendMessage("passportissueplace", { passportissueplace: simulatedApiResponse.passportissueplace });
            sendMessage("fathername", { fathername: simulatedApiResponse.fathername });
            sendMessage("mothername", { mothername: simulatedApiResponse.mothername });
            sendMessage("gender", { gender: simulatedApiResponse.gender });
        });

    }, 1000);
}


function fetchPassportData(passportNo) {

    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');
    const submitButton = document.getElementById('submitButton');

    // Disable submit button
    submitButton.disabled = true;

    // Show loader
    loader.style.display = 'block';

    // Introduce a delay before making the API call
    setTimeout(() => {
        // Example API endpoint, replace with your actual API endpoint
        const apiUrl = `https://localhost:7230/WeatherForecast/${passportNo}`;
      //  const apiUrl = `http://visaapi.parikshan.net/api/ChromeExtension/GetVisaPassengerDetail?PassportNo=${passportNo}&Country=1089`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) { 
                    debugger         
                    console.log(response.json());          
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(apiResponse => {

                console.log(apiResponse)
                // Assuming the API returns a JSON object with the expected fields
                const { nationality, dob, birthCountry, issuedateTime, expirdateTime, birthPlace, givenName, aliasName, issuplace,
                    fatherName, motherName, gender,comingFrom,language,religion
                } = apiResponse;

                // Clear any previous error
                resultDiv.classList.remove('error');
                // Hide loader
                document.getElementById('loader').style.display = 'none';

                // Enable submit button
                document.getElementById('submitButton').disabled = false;

                // Introduce a delay before sending messages to the content script
                setTimeout(() => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        const handleResponse = (response) => {
                            if (chrome.runtime.lastError) {
                                console.error('Runtime error:', chrome.runtime.lastError.message);  // Debug log
                                resultDiv.innerText = `Error: ${chrome.runtime.lastError.message}`;
                                resultDiv.classList.add('error');
                            } else if (!response) {
                                console.error('Error: No response received');  // Debug log
                                resultDiv.innerText = 'Error: No response received';
                                resultDiv.classList.add('error');
                            } else if (response.status === "success") {
                                console.log('Field updated successfully');  // Debug log
                            } else {
                                console.log('Error updating field:', response.message);  // Debug log
                                resultDiv.innerText = `Error: ${response.message}`;
                                resultDiv.classList.add('error');
                            }
                        };

                        const sendMessage = (action, data) => {
                            chrome.tabs.sendMessage(tabs[0].id, { action, data }, handleResponse);
                        };


                        sendMessage("presentNationality", { nationality });
                        sendMessage("dob", { dob });
                        sendMessage("birthCountry", { birthCountry });
                        sendMessage("dateofissue", { issuedateTime });
                        sendMessage("expireDate", { expirdateTime });
                        sendMessage("birthPlace", { birthPlace });
                        sendMessage("fname", { givenName });
                        sendMessage("lname", { aliasName });
                        sendMessage("passportissueplace", { issuplace });
                        sendMessage("fathername", { fatherName });
                        sendMessage("mothername", { motherName });
                        sendMessage("gender", { gender });
                        sendMessage("passport", { passportNo });

                        sendMessage("comingfrom", { comingFrom });                        
                        sendMessage("language", { language });
                      //sendMessage("religion", { religion });
                    });
                }, 1000); // Delay of 1 second before sending messages to the content script
            })
            .catch(error => {
                debugger
                // Hide loader
                document.getElementById('loader').style.display = 'none';
                // Enable submit button
                document.getElementById('submitButton').disabled = false;

                console.error('Error fetching data:', error);
                resultDiv.innerText = `Error: ${error.message}`;
                resultDiv.classList.add('error');
            });
    }, 1000); // Delay of 1 second before making the API call
}





// function loadExternalScript(scriptUrl) {
//     fetch(scriptUrl)
//     .then(response => response.text())  // Convert response to text
//                         .then(scriptContent => {
//                             // Create a blob from the script content
//                             const scriptBlob = new Blob([scriptContent], { type: 'application/javascript' });

//                             // Create a blob URL
//                             const scriptUrl = URL.createObjectURL(scriptBlob);

//                             // Create a script element and set its src to the Blob URL
//                             const script = document.createElement('script');
//                             script.type = 'text/javascript';
//                             script.src = scriptUrl;
//                             document.body.appendChild(script);
//                         })
//                         .catch(error => console.error('Error fetching or injecting script:', error));
//     }

// loadExternalScript('https://localhost:7230/WeatherForecast/getJsFile');


// document.addEventListener('DOMContentLoaded', function () {
//     fetch('https://localhost:7230/WeatherForecast/getJson')
//         .then(response => response.text())
//         .then(data => {
//             console.log('Fetched data:', data); // Log fetched data
//             const result = data.result;
//             const nonce = data.nonce;

//             const script = document.createElement('script');
//             script.type = 'text/javascript';
//             script.textContent = result;
//             script.setAttribute('nonce', nonce);

//             document.body.appendChild(script);
//         })
//         .catch(error => console.error('Error fetching JS file:', error));
// });









// document.addEventListener('DOMContentLoaded', function () {
//     const submitButton = document.getElementById('submitButton');
//     submitButton.addEventListener('click', function () {
//         const passportNo = document.getElementById('passportInput').value.trim();
//         const resultDiv = document.getElementById('result');
        
//         resultDiv.innerText = '';
//         resultDiv.classList.remove('error');

//         if (passportNo === '') {
//             resultDiv.innerText = 'Error: Passport number is required';
//             resultDiv.classList.add('error');
//         } else {
//             fetchDummyPassportData(passportNo);
//         }
//     });
// });

