import { spawn } from 'child_process';
import path from 'path';

export const callPremiumMLModel = (inputData) => {
  return new Promise((resolve, reject) => {
    // Determine the absolute path to predict_premium.py
    const mlPath = path.resolve(process.cwd(), '../ml/predict_premium.py');
    
    // Spawn python process
    const pythonProcess = spawn('python', [mlPath]);
    
    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error:', stderrData);
        // Fallback mock if python fails for demo purposes
        resolve({
          personalised_premium: inputData.base_premium,
          adjustment_reason: "Standard rate (Python ML Fallback)",
          risk_level: "medium"
        });
        return;
      }
      try {
        const result = JSON.parse(stdoutData.trim());
        resolve(result);
      } catch (err) {
        // Fallback
        resolve({
          personalised_premium: inputData.base_premium,
          adjustment_reason: "Standard rate (Parsing Fallback)",
          risk_level: "medium"
        });
      }
    });

    // Pass input data as JSON to stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();
  });
};
