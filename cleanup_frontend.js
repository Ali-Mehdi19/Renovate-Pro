const fs = require('fs');
const path = require('path');

const srcApp = path.join('my-app', 'src', 'app');
const dirsToMove = {
    'login': '(auth)/login',
    'register': '(auth)/register',
    'customerdashboard': '(dashboard)/customer',
    'plannerdashboard': '(dashboard)/planner',
    'surveyordashboard': '(dashboard)/surveyor'
};

// Create parent dirs
['(auth)', '(dashboard)'].forEach(d => {
    const p = path.join(srcApp, d);
    if (!fs.existsSync(p)) fs.mkdirSync(p);
});

Object.entries(dirsToMove).forEach(([oldName, newPath]) => {
    const oldDir = path.join(srcApp, oldName);
    const newDir = path.join(srcApp, newPath);

    if (fs.existsSync(oldDir)) {
        console.log(`Moving ${oldDir} to ${newDir}`);
        fs.cpSync(oldDir, newDir, { recursive: true });
        fs.rmSync(oldDir, { recursive: true, force: true });
    } else {
        console.log(`Skipping ${oldDir} (not found)`);
    }
});

// Remove redundant folders if empty or not needed
['plannerlogin', 'surveyorlogin', 'bookingsurvey', 'surveybooking'].forEach(d => {
    const p = path.join(srcApp, d);
    if (fs.existsSync(p)) {
        console.log(`Removing redundant ${p}`);
        fs.rmSync(p, { recursive: true, force: true });
    }
});

console.log("Cleanup complete.");
