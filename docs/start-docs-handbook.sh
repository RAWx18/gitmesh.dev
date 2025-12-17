#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 10

# Kill any existing gitbook processes
pkill -f gitbook 2>/dev/null
sleep 2

echo "Starting docs on port 4001..."
cd docs
gitbook serve --port 4001 --lrport 35729 > /tmp/gitbook-docs.log 2>&1 &
cd ..

sleep 3

echo "Starting handbook on port 4002..."
cd handbook
gitbook serve --port 4002 --lrport 35730 > /tmp/gitbook-handbook.log 2>&1 &
cd ..

echo ""
echo "=========================================="
echo "GitBooks running:"
echo "=========================================="
echo "Docs:      http://localhost:4001"
echo "Handbook:  http://localhost:4002"
echo "=========================================="
echo "Logs: tail -f /tmp/gitbook-*.log"
echo "Press Ctrl+C to stop"
echo ""

cleanup() {
    echo "Stopping servers..."
    pkill -f gitbook
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show logs
tail -f /tmp/gitbook-docs.log /tmp/gitbook-handbook.log
