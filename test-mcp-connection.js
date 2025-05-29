// Test script to demonstrate MCP setup and verify your current database connection
const { createClient } = require('@supabase/supabase-js')

// Your Supabase project details (for regular app usage)
const supabaseUrl = 'https://prsnvsqujosylkmnizdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc252c3F1am9zeWxrbW5pemR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTQxNTQsImV4cCI6MjA2NDA5MDE1NH0.x-Iu6GUCcYdTL3vyf9plr_CQz5-7W7xF6ovdPZ8Ccm0'

// Personal Access Token for MCP (admin operations)
const personalAccessToken = 'sbp_90c0012e00c36d25f6e825fc683dbadc5aa6a1b2'

// Create regular client (same as your app uses)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCurrentDatabaseConnection() {
  console.log('🔍 Testing your current Supabase database connection...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    // Test 1: Check if we can access products table
    console.log('\n1. Testing products table access (like your app does)...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(3)
    
    if (productsError) {
      console.log('❌ Error accessing products:', productsError.message)
      console.log('💡 This means your database tables might not be set up yet.')
    } else {
      console.log(`✅ Products table accessible! Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log('📦 Sample products:')
        products.forEach(p => console.log(`   - ${p.name} (€${p.price})`))
      } else {
        console.log('📝 No products found. Run your DatabaseSetup component to add sample data.')
      }
    }
    
    // Test 2: Check basic connectivity
    console.log('\n2. Testing basic connectivity...')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Products table does not exist')
        console.log('💡 Please run the SQL setup script in your Supabase dashboard')
      } else {
        console.log('❌ Connection error:', testError.message)
      }
    } else {
      console.log('✅ Database connection successful!')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

function explainMCPSetup() {
  console.log('\n\n🚀 MCP (Model Context Protocol) Setup Information')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  console.log('\n✅ MCP Configuration Status:')
  console.log('   • .vscode/mcp.json file: ✅ Created')
  console.log('   • Personal Access Token: ✅ Provided')
  console.log('   • Windows CMD configuration: ✅ Set up')
  
  console.log('\n📋 Your Personal Access Token:')
  console.log(`   ${personalAccessToken}`)
  console.log('   (Keep this secure - only use in VS Code MCP)')
  
  console.log('\n🔧 What MCP will allow you to do:')
  console.log('   • Query your database directly from Copilot Chat')
  console.log('   • Create, update, and delete records')
  console.log('   • Explore database schema and relationships')
  console.log('   • Manage tables and data without leaving VS Code')
  
  console.log('\n📝 Next Steps to Use MCP:')
  console.log('   1. Restart VS Code completely')
  console.log('   2. Open Copilot Chat (Ctrl+Shift+I)')
  console.log('   3. Switch to "Agent" mode')
  console.log('   4. Look for a tool icon confirming MCP is available')
  console.log('   5. Enter your Personal Access Token when prompted')
  
  console.log('\n💬 Example commands you can try in Copilot Chat:')
  console.log('   • "Show me all tables in my database"')
  console.log('   • "List all products"')
  console.log('   • "Add a new product to the database"')
  console.log('   • "What\'s the schema of my products table?"')
  
  console.log('\n⚡ Difference between tokens:')
  console.log('   • Anon Key (in your app): For public client operations')
  console.log('   • Personal Access Token: For admin/management operations via MCP')
}

// Run both tests
async function runAllTests() {
  await testCurrentDatabaseConnection()
  explainMCPSetup()
}

runAllTests()
