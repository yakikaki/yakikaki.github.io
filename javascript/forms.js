document.getElementById('suggestionForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value || "Anonymous";
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const tag = document.getElementById('tag').value;

    const AuthKey = "NB2HI4DTHIXS6ZDJONRW64TEFZRW63JPMFYGSL3XMVRGQ33PNNZS6MJSGYZTSMRQG4ZDGNBQGQZDKOJUGMZC63TCNFHTA6LQLJKFMZSJOBMUKRTQNV4DMX2KO4WVKODMMFNDS4ZWM5XUU6LJMJIWGQTBMZCXQ2KSKNIHEZ3NO5BWIN3XI5KG4QKOGZLWGNDCLI======";

    const webhookUrl = DecryptKey(AuthKey);

    const payload = {
        embeds: [
            {
                title: `${tag} - New Form Submission!`,
                fields: [
                    {
                        name: "Title",
                        value: title
                    },
                    {
                        name: "Name",
                        value: name
                    },
                    {
                        name: "Category",
                        value: category
                    },
                    {
                        name: "Description",
                        value: description
                    }
                ],
                color: 5814783
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("form submitted successfully!");
            document.getElementById('suggestionForm').reset();
        } else {
            alert("Failed to submit form.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting your form.");
    }
});

function DecryptKey(input) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const padding = '=';

    let output = '';
    let bits = 0;
    let value = 0;

    for (let i = 0; i < input.length; i++) {
        const index = alphabet.indexOf(input[i]);
        if (index === -1) continue;

        value = (value << 5) | index;
        bits += 5;

        if (bits >= 8) {
            output += String.fromCharCode((value >>> (bits - 8)) & 0xFF);
            bits -= 8;
        }
    }

    return output;
}
