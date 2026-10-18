// ==========================================
// MERCHANT UPI
// COMPLETE JAVASCRIPT
// ==========================================


// ==========================================
// UPI QR CODE
// ==========================================

// CHANGE THIS TO YOUR ACTUAL UPI ID

let upiID = "YOUR_UPI_ID@upi";

let merchantName = "MerchantUPI Store";


let upiLink =
    "upi://pay?pa=" +
    encodeURIComponent(upiID) +
    "&pn=" +
    encodeURIComponent(merchantName) +
    "&cu=INR";


let qrURL =
    "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
    encodeURIComponent(upiLink);


document.getElementById("upiQR").src = qrURL;


document.getElementById("displayUPI").innerText =
    upiID;


// ==========================================
// PAYMENT DATA
// ==========================================

let transactions = [];

let totalSales = 0;

let successfulPayments = 0;

let unusualTransactions = 0;


// ==========================================
// RECEIVE PAYMENT
// AUTOMATIC FRAUD DETECTION
// ==========================================

function receivePayment() {

    let name =
        document
        .getElementById("customerName")
        .value
        .trim();


    let amount =
        Number(
            document
            .getElementById("upiAmount")
            .value
        );


    let status =
        document.getElementById(
            "paymentStatus"
        );


    // VALIDATION

    if (name === "") {

        status.innerHTML =
            "⚠️ Please enter customer name.";

        return;

    }


    if (amount <= 0) {

        status.innerHTML =
            "⚠️ Please enter a valid amount.";

        return;

    }


    // ==========================================
    // AUTOMATIC RISK ANALYSIS
    // ==========================================

    let riskScore = 0;

    let reasons = [];


    // ------------------------------------------
    // 1. AMOUNT CHECK
    // ------------------------------------------

    if (amount >= 50000) {

        riskScore += 50;

        reasons.push(
            "Very high transaction amount"
        );

    }

    else if (amount >= 20000) {

        riskScore += 25;

        reasons.push(
            "Higher-than-normal transaction amount"
        );

    }


    // ==========================================
    // 2. PREVIOUS TRANSACTION COMPARISON
    // ==========================================

    if (transactions.length > 0) {

        let previousTotal = 0;


        transactions.forEach(
            function(transaction) {

                previousTotal +=
                    transaction.amount;

            }
        );


        let averageAmount =
            previousTotal /
            transactions.length;


        if (
            amount > averageAmount * 3 &&
            amount >= 10000
        ) {

            riskScore += 30;

            reasons.push(
                "Amount is much higher than previous average"
            );

        }

    }


    // ==========================================
    // 3. SAME CUSTOMER FREQUENCY
    // ==========================================

    let sameCustomer =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.name.toLowerCase()
                    ===
                    name.toLowerCase()
                );

            }
        );


    if (sameCustomer.length >= 3) {

        riskScore += 15;

        reasons.push(
            "Multiple transactions from same customer"
        );

    }


    // ==========================================
    // 4. LARGE PAYMENT FROM EXISTING CUSTOMER
    // ==========================================

    if (
        sameCustomer.length > 0 &&
        amount >= 20000
    ) {

        riskScore += 20;

        reasons.push(
            "Large payment from previously recorded customer"
        );

    }


    // ==========================================
    // 5. TRANSACTION FREQUENCY
    // ==========================================

    let now = Date.now();


    let recentTransactions =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.timestamp &&
                    now -
                    transaction.timestamp
                    <
                    5 * 60 * 1000
                );

            }
        );


    if (recentTransactions.length >= 5) {

        riskScore += 25;

        reasons.push(
            "Unusually high transaction frequency"
        );

    }


    // ==========================================
    // LIMIT RISK SCORE
    // ==========================================

    if (riskScore > 100) {

        riskScore = 100;

    }


    // ==========================================
    // DETERMINE RISK
    // ==========================================

    let risk;


    if (riskScore >= 70) {

        risk = "🚨 HIGH RISK";

        unusualTransactions++;

    }

    else if (riskScore >= 40) {

        risk = "⚠️ REVIEW";

        unusualTransactions++;

    }

    else {

        risk = "✅ NORMAL";

    }


    // ==========================================
    // RECORD TRANSACTION
    // ==========================================

    successfulPayments++;

    totalSales += amount;


    let transaction = {

        name: name,

        amount: amount,

        risk: risk,

        riskScore: riskScore,

        time:
            new Date()
            .toLocaleTimeString(),

        timestamp:
            Date.now()

    };


    transactions.push(
        transaction
    );


    // ==========================================
    // UPDATE WEBSITE
    // ==========================================

    updateBusinessStats();

    showTransactions();

    updateSalesAnalytics();

    generateSmartAlerts();


    // ==========================================
    // SHOW AUTOMATIC RESULT
    // ==========================================

    if (riskScore >= 70) {

        status.innerHTML =

            "🚨 <strong>HIGH RISK TRANSACTION</strong>" +

            "<br><br>" +

            "Customer: " +
            name +

            "<br>" +

            "Amount: ₹" +
            amount.toLocaleString("en-IN") +

            "<br><br>" +

            "Risk Score: " +
            riskScore +
            "/100" +

            "<br><br>" +

            "⚠️ " +
            reasons.join(
                "<br>⚠️ "
            ) +

            "<br><br>" +

            "🔎 Recommended Action: Review transaction.";

    }


    else if (riskScore >= 40) {

        status.innerHTML =

            "⚠️ <strong>TRANSACTION NEEDS REVIEW</strong>" +

            "<br><br>" +

            "Customer: " +
            name +

            "<br>" +

            "Amount: ₹" +
            amount.toLocaleString("en-IN") +

            "<br><br>" +

            "Risk Score: " +
            riskScore +
            "/100" +

            "<br><br>" +

            "⚠️ " +
            reasons.join(
                "<br>⚠️ "
            ) +

            "<br><br>" +

            "🔍 Recommended Action: Verify transaction.";

    }


    else {

        status.innerHTML =

            "✅ <strong>TRANSACTION LOOKS NORMAL</strong>" +

            "<br><br>" +

            "Customer: " +
            name +

            "<br>" +

            "Amount: ₹" +
            amount.toLocaleString("en-IN") +

            "<br><br>" +

            "Risk Score: " +
            riskScore +
            "/100" +

            "<br><br>" +

            "No unusual pattern detected.";

    }


    // ==========================================
    // CLEAR INPUT
    // ==========================================

    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "upiAmount"
    ).value = "";

}


// ==========================================
// DASHBOARD
// ==========================================

function updateBusinessStats() {

    let count =
        transactions.length;


    let successRate = 0;


    if (count > 0) {

        successRate =
            (
                successfulPayments /
                count
            ) * 100;

    }


    document.getElementById(
        "totalTransactions"
    ).innerText =
        count;


    document.getElementById(
        "totalSales"
    ).innerText =
        "₹" +
        totalSales.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "successRate"
    ).innerText =
        Math.round(
            successRate
        ) + "%";


    document.getElementById(
        "unusualCount"
    ).innerText =
        unusualTransactions;

}


// ==========================================
// TRANSACTIONS
// ==========================================

function showTransactions() {

    let list =
        document.getElementById(
            "transactionList"
        );


    list.innerHTML = "";


    if (
        transactions.length === 0
    ) {

        list.innerHTML =

            '<div class="empty">' +

            'No transactions yet.' +

            '</div>';

        return;

    }


    let reversed =
        [...transactions]
        .reverse();


    reversed.forEach(
        function(transaction) {


            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "transaction-card";


            card.innerHTML =

                "<h3>👤 " +
                escapeHTML(
                    transaction.name
                ) +
                "</h3>" +

                "<p>💰 Amount: ₹" +
                transaction.amount
                    .toLocaleString(
                        "en-IN"
                    ) +
                "</p>" +

                "<p>🕒 " +
                transaction.time +
                "</p>" +

                "<p>" +
                transaction.risk +
                "</p>" +

                "<p>🎯 Risk Score: " +
                transaction.riskScore +
                "/100</p>";


            list.appendChild(
                card
            );

        }
    );

}


// ==========================================
// ANOMALY DETECTION
// ==========================================

function checkTransaction() {

    let amount =
        Number(
            document
            .getElementById(
                "checkAmount"
            )
            .value
        );


    let result =
        document.getElementById(
            "transactionResult"
        );


    if (amount <= 0) {

        result.innerHTML =
            "⚠️ Please enter a valid amount.";

        return;

    }


    if (amount >= 50000) {

        result.innerHTML =

            "🚨 <strong>HIGH RISK TRANSACTION</strong>" +

            "<br><br>" +

            "An unusually large transaction " +
            "has been detected." +

            "<br><br>" +

            "Recommended Action: Review the transaction.";

    }


    else if (amount >= 20000) {

        result.innerHTML =

            "⚠️ <strong>REVIEW REQUIRED</strong>" +

            "<br><br>" +

            "This transaction is higher " +
            "than the normal range." +

            "<br><br>" +

            "Recommended Action: Verify before proceeding.";

    }


    else {

        result.innerHTML =

            "✅ <strong>NORMAL TRANSACTION</strong>" +

            "<br><br>" +

            "No unusual amount-based " +
            "activity detected.";

    }

}


// ==========================================
// MANUAL FRAUD DETECTION
// ==========================================

function detectFraud() {

    let amount =
        Number(
            document.getElementById(
                "fraudAmount"
            ).value
        );


    let count =
        Number(
            document.getElementById(
                "fraudCount"
            ).value
        );


    let result =
        document.getElementById(
            "fraudResult"
        );


    if (
        amount <= 0 ||
        count <= 0
    ) {

        result.innerHTML =
            "⚠️ Please enter valid information.";

        return;

    }


    let riskPoints = 0;

    let reasons = [];


    if (amount >= 50000) {

        riskPoints += 50;

        reasons.push(
            "Unusually high transaction amount"
        );

    }

    else if (amount >= 20000) {

        riskPoints += 25;

        reasons.push(
            "Higher-than-normal transaction amount"
        );

    }


    if (count >= 20) {

        riskPoints += 30;

        reasons.push(
            "High number of transactions today"
        );

    }

    else if (count >= 10) {

        riskPoints += 15;

        reasons.push(
            "Increased transaction frequency"
        );

    }


    if (riskPoints >= 60) {

        result.innerHTML =

            "🚨 <strong>HIGH FRAUD RISK</strong>" +

            "<br><br>" +

            reasons.join("<br>") +

            "<br><br>" +

            "⚠️ Recommended Action: Verify the transaction.";

    }


    else if (riskPoints >= 30) {

        result.innerHTML =

            "⚠️ <strong>MEDIUM RISK</strong>" +

            "<br><br>" +

            reasons.join("<br>") +

            "<br><br>" +

            "🔍 Recommended Action: Review the transaction.";

    }


    else {

        result.innerHTML =

            "✅ <strong>LOW RISK</strong>" +

            "<br><br>" +

            "No major risk indicators detected.";

    }

}


// ==========================================
// CREDIT SCORE
// ==========================================

function calculateCreditScore() {

    let transactionCount =
        Number(
            document.getElementById(
                "transactions"
            ).value
        );


    let successful =
        Number(
            document.getElementById(
                "successful"
            ).value
        );


    let sales =
        Number(
            document.getElementById(
                "sales"
            ).value
        );


    let result =
        document.getElementById(
            "creditResult"
        );


    if (

        transactionCount <= 0 ||

        successful < 0 ||

        successful >
        transactionCount ||

        sales <= 0

    ) {

        result.innerHTML =
            "⚠️ Please enter valid information.";

        return;

    }


    let successRate =
        (
            successful /
            transactionCount
        ) * 100;


    let score = 300;


    score +=
        successRate * 3;


    if (
        transactionCount >= 100
    ) {

        score += 100;

    }

    else if (
        transactionCount >= 50
    ) {

        score += 60;

    }

    else {

        score += 30;

    }


    if (
        sales >= 100000
    ) {

        score += 100;

    }

    else if (
        sales >= 50000
    ) {

        score += 70;

    }

    else {

        score += 40;

    }


    if (score > 900) {

        score = 900;

    }


    let status;


    if (score >= 750) {

        status =
            "🟢 Excellent";

    }

    else if (score >= 650) {

        status =
            "🟡 Good";

    }

    else {

        status =
            "🔴 Needs Improvement";

    }


    result.innerHTML =

        "💳 <strong>Estimated Merchant Credit Readiness</strong>" +

        "<br><br>" +

        "<strong>" +

        Math.round(score) +

        "/900" +

        "</strong>" +

        "<br><br>" +

        "Status: " +

        status +

        "<br><br>" +

        "<small>" +

        "Prototype estimate based on business activity; " +
        "not an official bank or credit-bureau score." +

        "</small>";

}


// ==========================================
// SALES ANALYTICS
// ==========================================

function updateSalesAnalytics() {

    let count =
        transactions.length;


    let average =
        count > 0
        ? totalSales / count
        : 0;


    document.getElementById(
        "analyticsSales"
    ).innerText =

        "₹" +
        totalSales.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "analyticsTransactions"
    ).innerText =

        count;


    document.getElementById(
        "averageTransaction"
    ).innerText =

        "₹" +
        Math.round(average)
        .toLocaleString(
            "en-IN"
        );


    let bars =
        document.getElementById(
            "salesBars"
        );


    bars.innerHTML = "";


    if (count === 0) {

        bars.innerHTML =

            '<p class="empty">' +

            'Record transactions to generate sales insights.' +

            '</p>';

        return;

    }


    let recent =
        transactions.slice(-7);


    let maxAmount =
        Math.max(
            ...recent.map(
                function(t) {

                    return t.amount;

                }
            )
        );


    recent.forEach(
        function(transaction) {


            let bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "sales-bar";


            let width =
                (
                    transaction.amount /
                    maxAmount
                ) * 100;


            bar.style.width =
                Math.max(
                    width,
                    15
                ) + "%";


            bar.innerText =

                "₹" +
                transaction.amount
                    .toLocaleString(
                        "en-IN"
                    );


            bars.appendChild(
                bar
            );

        }
    );


    let insight =
        document.getElementById(
            "salesInsight"
        );


    if (average >= 10000) {

        insight.innerHTML =

            "📈 Your average transaction value is relatively high. " +
            "Monitor large transactions carefully.";

    }

    else {

        insight.innerHTML =

            "💡 Your current transaction values are within a smaller range. " +
            "Continue monitoring your sales trend.";

    }

}


// ==========================================
// SMART ALERTS
// ==========================================

function generateSmartAlerts() {

    let alerts =
        document.getElementById(
            "smartAlerts"
        );


    alerts.innerHTML = "";


    if (transactions.length === 0) {

        alerts.innerHTML =

            `<div class="alert-card normal-alert">

                <span class="alert-icon">
                    💡
                </span>

                <div>

                    <strong>
                        Smart Alert System
                    </strong>

                    <p>
                        Your business alerts will appear here automatically.
                    </p>

                </div>

            </div>`;

        return;

    }


    let latest =
        transactions[
            transactions.length - 1
        ];


    // HIGH RISK ALERT

    if (
        latest.riskScore >= 70
    ) {

        alerts.innerHTML +=

            `<div class="alert-card danger-alert">

                <span class="alert-icon">
                    🚨
                </span>

                <div>

                    <strong>
                        High Fraud Risk
                    </strong>

                    <p>
                        Transaction of ₹${latest.amount.toLocaleString("en-IN")}
                        received a risk score of
                        ${latest.riskScore}/100.
                    </p>

                </div>

            </div>`;

    }


    // REVIEW ALERT

    else if (
        latest.riskScore >= 40
    ) {

        alerts.innerHTML +=

            `<div class="alert-card warning-alert">

                <span class="alert-icon">
                    ⚠️
                </span>

                <div>

                    <strong>
                        Transaction Review
                    </strong>

                    <p>
                        A transaction requires additional review.
                    </p>

                </div>

            </div>`;

    }


    // NORMAL

    else {

        alerts.innerHTML +=

            `<div class="alert-card success-alert">

                <span class="alert-icon">
                    ✅
                </span>

                <div>

                    <strong>
                        Business Activity Normal
                    </strong>

                    <p>
                        Latest transaction does not show
                        a major risk indicator.
                    </p>

                </div>

            </div>`;

    }


    // BUSINESS ACTIVITY

    if (
        transactions.length >= 5
    ) {

        alerts.innerHTML +=

            `<div class="alert-card normal-alert">

                <span class="alert-icon">
                    📊
                </span>

                <div>

                    <strong>
                        Business Activity Update
                    </strong>

                    <p>
                        ${transactions.length}
                        transactions have been recorded.
                    </p>

                </div>

            </div>`;

    }

}


// ==========================================
// AI ROBOT
// ==========================================

function toggleChat() {

    let chat =
        document.getElementById(
            "aiChatBox"
        );


    chat.classList.toggle(
        "active"
    );

}


// ==========================================
// ENTER KEY
// ==========================================

function handleAIEnter(event) {

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        sendAIMessage();

    }

}


// ==========================================
// SEND AI MESSAGE
// ==========================================

async function sendAIMessage() {

    let input =
        document.getElementById(
            "aiInput"
        );


    let message =
        input.value.trim();


    if (message === "") {

        return;

    }


    // USER MESSAGE

    addAIMessage(
        message,
        "user"
    );


    input.value = "";


    // THINKING

    let thinking =
        addAIMessage(
            "🤖 Thinking...",
            "ai"
        );


    try {


        let response =
            await fetch(
                "/chat",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                message

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error"
            );

        }


        let data =
            await response.json();


        thinking.remove();


        addAIMessage(

            data.reply ||
            "⚠️ I couldn't generate a response.",

            "ai"

        );


    }


    catch (error) {


        console.error(
            "AI Error:",
            error
        );


        thinking.remove();


        addAIMessage(

            "⚠️ AI connection failed. Please make sure Flask is running.",

            "ai"

        );

    }

}


// ==========================================
// ADD AI MESSAGE
// ==========================================

function addAIMessage(
    message,
    type
) {

    let messages =
        document.getElementById(
            "aiMessages"
        );


    let div =
        document.createElement(
            "div"
        );


    if (
        type === "user"
    ) {

        div.className =
            "ai-message user-message";

    }

    else {

        div.className =
            "ai-message";

    }


    div.innerText =
        message;


    messages.appendChild(
        div
    );


    messages.scrollTop =
        messages.scrollHeight;


    return div;

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

    let div =
        document.createElement(
            "div"
        );

    div.innerText = text;

    return div.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

updateBusinessStats();

updateSalesAnalytics();

generateSmartAlerts();

showTransactions();