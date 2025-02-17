const { google } = require("googleapis");

const projectId = "YOUR_PROJECT_ID"; // Update with GCP project ID
const auth = new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });

exports.manageInstancesOnBudget = async (event, context) => {
  try {
    // Decode Pub/Sub message
    const message = Buffer.from(event.data, "base64").toString();
    const budgetData = JSON.parse(message);

    console.log(`📩 [${new Date().toISOString()}] Received Budget Alert:`, budgetData);

    // Validate the budget data
    if (!budgetData.costAmount || isNaN(budgetData.costAmount)) {
      console.error("❌ Budget data missing or invalid costAmount. Exiting.");
      return;
    }

    if (budgetData.costAmount >= 10) {
      console.log("⚠️ Budget exceeded! Stopping all instances...");
      await stopInstances();
    } else {
      console.log("✅ Budget under limit. Restarting instances...");
      await startInstances();
    }
  } catch (error) {
    console.error("❌ Error processing budget alert:", error);
  }
};

// Function to stop all running VMs
async function stopInstances() {
  const compute = google.compute("v1");
  const instancesRes = await compute.instances.aggregatedList({ project: projectId, auth });

  let instances = [];
  for (const [zonePath, data] of Object.entries(instancesRes.data.items || {})) {
    if (data.instances) {
      const zone = zonePath.split("/").pop();
      instances.push(...data.instances.map(instance => ({ name: instance.name, zone })));
    }
  }

  if (instances.length === 0) {
    console.log("⚠️ No running instances found.");
    return;
  }

  for (const { name, zone } of instances) {
    console.log(`🔴 Stopping VM: ${name} in ${zone}...`);
    try {
      await compute.instances.stop({ project: projectId, zone, instance: name, auth });
      console.log(`✅ Successfully stopped ${name} in ${zone}`);
    } catch (error) {
      console.error(`❌ Error stopping ${name} in ${zone}:`, error.message);
    }
  }
}

// Function to restart all stopped VMs
async function startInstances() {
  const compute = google.compute("v1");
  const instancesRes = await compute.instances.aggregatedList({ project: projectId, auth });

  let instances = [];
  for (const [zonePath, data] of Object.entries(instancesRes.data.items || {})) {
    if (data.instances) {
      const zone = zonePath.replace("zones/", "").split("/").pop();
      instances.push(...data.instances.map(instance => ({ name: instance.name, zone })));
    }
  }

  if (instances.length === 0) {
    console.log("⚠️ No stopped instances found.");
    return;
  }

  for (const { name, zone } of instances) {
    console.log(`▶️ Starting VM: ${name} in ${zone}...`);
    try {
      await compute.instances.start({ project: projectId, zone, instance: name, auth });
      console.log(`✅ Successfully started ${name} in ${zone}`);
    } catch (error) {
      console.error(`❌ Error starting ${name} in ${zone}:`, error.message);
    }
  }
}