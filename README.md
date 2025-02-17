# 📌 Google Cloud Budget Automation – Stop & Start VMs

## 🖥️ Overview

This Cloud Function **automates instance management** based on budget alerts from Google Cloud Billing.

- **If budget exceeds $10** → **Stops all instances**
- **If budget is below $10** → **Restarts all instances**

It listens for budget alerts via **Google Pub/Sub** and takes action accordingly.

## 🚀 Setup & Deployment Guide

### 1️⃣ Prerequisites

Ensure you have the following:

- ✅ **Google Cloud Project** with **Compute Engine & Cloud Functions enabled**
- ✅ **Billing Alerts & Budgets configured**
- ✅ **Pub/Sub topic** (`budget-alerts`) linked to the budget
- ✅ **IAM roles** assigned to service accounts

### 2️⃣ Deploying the Function

#### 💡 Step 1: Clone the Repository

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/budget-automation.git
cd budget-automation
```

#### 💡 Step 2: Install Dependencies

```sh
npm install
```

#### 💡 Step 3: Deploy the Cloud Function

```sh
gcloud functions deploy manageInstancesOnBudget \
    --runtime=nodejs20 \
    --trigger-topic=budget-alerts \
    --service-account=budget-automation-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com \
    --region=us-central1 \
    --allow-unauthenticated
```

🚀 This deploys the function to **Google Cloud Functions** and links it to the **budget-alerts Pub/Sub topic**.

## ⚙️ How It Works

### 🔹 Step 1: Receiving Budget Alerts

1. The function listens to **budget-alerts** from **Google Cloud Billing**
2. It **extracts the budget amount** (`costAmount`)
3. **If** `costAmount` >= 10 → It **stops all Compute Engine instances**
4. **If** `costAmount` < 10 → It **restarts all stopped instances**

### 🔹 Step 2: Stopping/Starting Instances

#### 🔴 Stopping VMs:

- Lists **all running instances**
- Calls **Google Compute API** to stop them

#### ▶️ Starting VMs:

- Lists **all stopped instances**
- Calls **Google Compute API** to restart them

## 📜 Code Structure

```
📂 budget-automation/
┣ 📜 index.js     # Main Cloud Function logic
┣ 📜 package.json # Dependencies & scripts
┣ 📜 README.md    # Documentation
```
