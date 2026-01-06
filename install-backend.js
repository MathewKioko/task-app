#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.join(__dirname, 'backend');

console.log('Installing backend dependencies...');

try {
  // Check if bun.lockb exists (indicating Bun is being used)
  const bunLockPath = path.join(backendDir, 'bun.lockb');
  const hasBunLock = fs.existsSync(bunLockPath);
  
  // Check if package-lock.json exists (indicating npm is being used)
  const npmLockPath = path.join(backendDir, 'package-lock.json');
  const hasNpmLock = fs.existsSync(npmLockPath);
  
  // Determine which package manager to use
  let command;
  if (hasBunLock) {
    command = 'bun install';
    console.log('Using Bun (bun.lockb detected)');
  } else if (hasNpmLock) {
    command = 'npm install';
    console.log('Using npm (package-lock.json detected)');
  } else {
    // Fallback: try bun first, then npm
    try {
      execSync('bun --version', { stdio: 'ignore' });
      command = 'bun install';
      console.log('Using Bun (bun available)');
    } catch {
      command = 'npm install';
      console.log('Using npm (fallback)');
    }
  }
  
  // Run the installation
  process.chdir(backendDir);
  execSync(command, { stdio: 'inherit' });
  
  console.log('Backend dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install backend dependencies:', error.message);
  process.exit(1);
}