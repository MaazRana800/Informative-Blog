// Script to update Railway environment variables
const { execSync } = require('child_process');

// Your MongoDB connection string
const MONGODB_URI = "mongodb+srv://Blog:<Maazkhan268xyz>@project268.oiatp3h.mongodb.net/?appName=Project268";

console.log('Updating Railway environment variables...');

try {
  // Update MONGODB_URI
  execSync(`railway variables set MONGODB_URI="${MONGODB_URI}"`, { stdio: 'inherit' });
  console.log('✅ MONGODB_URI updated successfully!');
  
  console.log('🔄 Redeploying Railway service...');
  execSync('railway up', { stdio: 'inherit' });
  console.log('✅ Railway service redeployed!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure you are logged into Railway CLI: railway login');
}
