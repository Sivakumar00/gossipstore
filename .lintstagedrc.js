module.exports = {
  // Run lint and type checking on entire workspace, but format only staged files
  '**/*.{ts,tsx,js,jsx,md}': [
    () => 'pnpm check-types', // Type check entire workspace
    () => 'pnpm lint', // Lint entire workspace
    'pnpm prettier --write', // Format only staged files
  ],
};
