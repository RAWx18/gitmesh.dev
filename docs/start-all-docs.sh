#!/bin/bash

# Load nvm (different shells load it differently)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ensure we're using Node 10
nvm use 10

# Function to setup and serve a gitbook directory
serve_gitbook() {
    local dir=$1
    local port=$2
    local lrport=$3
    
    echo "Setting up $dir on port $port..."
    
    cd "$dir"
    
    # Create book.json WITHOUT livereload
    cat > book.json << 'BOOKJSON'
{
  "plugins": [
    "hints",
    "youtube",
    "-livereload",
    "highlight",
    "search",
    "lunr",
    "sharing",
    "fontsettings",
    "theme-default"
  ]
}
BOOKJSON
    
    # Install plugins
    gitbook install
    
    # Fix YouTube embeds
    find . -name "*.md" -type f -exec sed -i 's/{% embed url="https:\/\/youtu\.be\/\([^"]*\)" %}/{% youtube %}\1{% endyoutube %}/g' {} \; 2>/dev/null
    
    # Serve in background with custom livereload port
    GITBOOK_DIR=$(pwd) gitbook serve --port "$port" --lrport "$lrport" > "/tmp/gitbook-${dir}.log" 2>&1 &
    
    cd - > /dev/null
}

# Kill any existing gitbook processes
pkill -f gitbook 2>/dev/null

# Wait a moment for ports to free up
sleep 2

# Serve each directory with different livereload ports
serve_gitbook "docs" 4001 35729
sleep 3
serve_gitbook "handbook" 4002 35730
sleep 3
serve_gitbook "reference" 4003 35731

echo ""
echo "=========================================="
echo "All GitBooks are starting..."
echo "=========================================="
echo "Docs:      http://localhost:4001"
echo "Handbook:  http://localhost:4002"
echo "Reference: http://localhost:4003"
echo "=========================================="
echo "Logs are in /tmp/gitbook-*.log"
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all GitBook servers..."
    pkill -f gitbook
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
tail -f /tmp/gitbook-docs.log /tmp/gitbook-handbook.log /tmp/gitbook-reference.log
