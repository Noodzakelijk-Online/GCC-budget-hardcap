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

## 🔑 IAM Permissions Needed

For the **service account** (`budget-automation-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com`), assign these **IAM roles**:

| Role                             | Purpose                              |
| -------------------------------- | ------------------------------------ |
| `roles/compute.instanceAdmin.v1` | Manage Compute Engine instances      |
| `roles/pubsub.subscriber`        | Listen to budget alerts from Pub/Sub |
| `roles/cloudfunctions.invoker`   | Allow invoking the Cloud Function    |

✅ Assign roles using:

```sh
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:budget-automation-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.instanceAdmin.v1"
```

## 🛠️ Debugging

Check logs in **Google Cloud Console**:

```sh
gcloud functions logs read manageInstancesOnBudget
```

If Pub/Sub isn't triggering:

```sh
gcloud pubsub subscriptions pull projects/YOUR_PROJECT_ID/subscriptions/budget-alerts-sub --auto-ack
```

## 📜 Code Structure

```
📂 budget-automation/
┣ 📜 index.js     # Main Cloud Function logic
┣ 📜 package.json # Dependencies & scripts
┣ 📜 README.md    # Documentation
```

## ✅ Conclusion

- This function **automates Google Cloud instance management** based on **budget alerts**
- Supports **any billing account** as long as it publishes to the `budget-alerts` Pub/Sub topic
- Fully **configurable** and **easy to deploy**
