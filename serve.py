#!/usr/bin/env python3
"""
Simple script to run Pelican development server locally
"""
import os
import subprocess
import sys

def main():
    """Run Pelican with development settings"""
    try:
        # Generate the site
        subprocess.run(['pelican', 'content'], check=True)
        
        # Start the development server
        subprocess.run(['pelican', '--listen', '--autoreload'], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"Error running Pelican: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopping development server...")
        sys.exit(0)

if __name__ == "__main__":
    main()