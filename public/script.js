document.getElementById("runTest").onclick = async () => {

    const payload = {

        browser: {

            online: navigator.onLine,

            language: navigator.language,

            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

            connection: navigator.connection
                ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData
                }
                : null

        }

    };

    const res = await fetch("/collect", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)

    });

    const data = await res.json();

    document.getElementById("result").textContent =
        JSON.stringify(data, null, 4);

};