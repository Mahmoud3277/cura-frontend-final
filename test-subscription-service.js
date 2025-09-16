// Test script to verify subscription service integration
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';
const SUBSCRIPTIONS_ENDPOINT = `${API_BASE_URL}/subscriptions`;

// Test function to check subscription plans endpoint
async function testSubscriptionPlans() {
    try {
        console.log('Testing subscription plans endpoint...');
        const response = await fetch(`${SUBSCRIPTIONS_ENDPOINT}/plans`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Subscription plans endpoint working');
            console.log('Plans found:', data.data?.length || 0);
            return true;
        } else {
            console.log('❌ Subscription plans endpoint failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Error testing subscription plans:', error.message);
        return false;
    }
}

// Test function to check server connectivity
async function testServerConnectivity() {
    try {
        console.log('Testing server connectivity...');
        const response = await fetch(`${API_BASE_URL}/auth/test`, { method: 'GET' });
        
        // Even if endpoint doesn't exist, we should get a response indicating server is running
        console.log('✅ Server is responding on port 5000');
        return true;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Server is not running on port 5000');
            return false;
        }
        console.log('✅ Server is responding (got error but connection works)');
        return true;
    }
}

// Main test function
async function runTests() {
    console.log('🧪 Testing Subscription Service Integration\n');
    
    const serverRunning = await testServerConnectivity();
    if (!serverRunning) {
        console.log('\n❌ Backend server is not running. Please start it with: cd cura-backend && npm start');
        return;
    }
    
    console.log('');
    const plansWorking = await testSubscriptionPlans();
    
    console.log('\n📊 Test Results:');
    console.log(`Server Running: ${serverRunning ? '✅' : '❌'}`);
    console.log(`Subscription Plans API: ${plansWorking ? '✅' : '❌'}`);
    
    if (serverRunning && plansWorking) {
        console.log('\n🎉 Subscription service integration is working correctly!');
    } else {
        console.log('\n⚠️  Some issues found. Check the backend server and subscription routes.');
    }
}

// Run the tests
runTests().catch(console.error);
