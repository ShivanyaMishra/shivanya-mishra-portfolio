import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateResume() {
  const doc = await PDFDocument.create();

  // Load fonts
  const fontRegular = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  // A4 dimensions: 595.28 x 841.89
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 42;
  const contentWidth = pageWidth - marginX * 2;

  // Read profile image
  let embeddedImage = null;
  const imagePath = path.resolve('public/shivi.png');
  if (fs.existsSync(imagePath)) {
    const imageBytes = fs.readFileSync(imagePath);
    try {
      embeddedImage = await doc.embedPng(imageBytes);
    } catch (err) {
      console.warn('Could not embed PNG directly:', err);
    }
  }

  // --- PAGE 1 ---
  const page1 = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 40;

  // Header Left: Name & Contact Details
  page1.drawText('SHIVANYA MISHRA', {
    x: marginX,
    y: y,
    size: 19,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  const contactStartY = y - 20;
  const contactLines = [
    { label: 'Email: ', val: 'shivanyamishra84@gmail.com' },
    { label: 'Phone: ', val: '+91 8447402891' },
    { label: 'LinkedIn: ', val: 'linkedin.com/in/shivanya-mishra' },
    { label: 'GitHub: ', val: 'github.com/ShivanyaMishra' },
    { label: 'Portfolio: ', val: 'shivanya-mishra-data-analyst-portfolio' },
  ];

  contactLines.forEach((item, idx) => {
    const lineY = contactStartY - idx * 13;
    page1.drawText(item.label, {
      x: marginX,
      y: lineY,
      size: 9.5,
      font: fontBold,
      color: rgb(0.15, 0.15, 0.15),
    });
    const labelWidth = fontBold.widthOfTextAtSize(item.label, 9.5);
    page1.drawText(item.val, {
      x: marginX + labelWidth,
      y: lineY,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });
  });

  // Top Right Photo
  if (embeddedImage) {
    const photoWidth = 68;
    const photoHeight = 84;
    const photoX = pageWidth - marginX - photoWidth;
    const photoY = y - 66;

    page1.drawImage(embeddedImage, {
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
    });

    // Thin elegant border around photo
    page1.drawRectangle({
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
      borderColor: rgb(0.65, 0.65, 0.65),
      borderWidth: 0.5,
    });
  }

  y = contactStartY - contactLines.length * 13 - 10;

  function drawSectionHeader(page, title, currentY) {
    page.drawText(title, {
      x: marginX,
      y: currentY,
      size: 10.5,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });
    currentY -= 4;
    page.drawLine({
      start: { x: marginX, y: currentY },
      end: { x: pageWidth - marginX, y: currentY },
      thickness: 0.75,
      color: rgb(0.2, 0.2, 0.2),
    });
    return currentY - 12;
  }

  function drawWrappedText(page, text, startX, startY, maxWidth, size = 9, font = fontRegular, color = rgb(0.12, 0.12, 0.12), lineSpacing = 12.5) {
    const words = text.split(' ');
    let currentLine = '';
    let currY = startY;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && currentLine) {
        page.drawText(currentLine, { x: startX, y: currY, size, font, color });
        currY -= lineSpacing;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      page.drawText(currentLine, { x: startX, y: currY, size, font, color });
      currY -= lineSpacing;
    }
    return currY;
  }

  function drawBulletItem(page, boldPrefix, bodyText, currentY, size = 8.8) {
    page.drawText('•', {
      x: marginX + 8,
      y: currentY,
      size: size,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    const bodyX = marginX + 18;
    const maxWidth = contentWidth - 18;

    if (boldPrefix) {
      const prefixWidth = fontBold.widthOfTextAtSize(boldPrefix, size);
      page.drawText(boldPrefix, {
        x: bodyX,
        y: currentY,
        size: size,
        font: fontBold,
        color: rgb(0.08, 0.08, 0.08),
      });

      // Wrap the remainder of the text starting after the prefix
      const fullText = bodyText;
      const words = fullText.split(' ');
      let line = '';
      let isFirstLine = true;
      let currY = currentY;

      for (let i = 0; i < words.length; i++) {
        const testLine = line ? line + ' ' + words[i] : words[i];
        const availableWidth = isFirstLine ? maxWidth - prefixWidth : maxWidth;
        const testWidth = fontRegular.widthOfTextAtSize(testLine, size);

        if (testWidth > availableWidth && line) {
          page.drawText(line, {
            x: isFirstLine ? bodyX + prefixWidth : bodyX,
            y: currY,
            size: size,
            font: fontRegular,
            color: rgb(0.12, 0.12, 0.12),
          });
          currY -= 11.5;
          line = words[i];
          isFirstLine = false;
        } else {
          line = testLine;
        }
      }

      if (line) {
        page.drawText(line, {
          x: isFirstLine ? bodyX + prefixWidth : bodyX,
          y: currY,
          size: size,
          font: fontRegular,
          color: rgb(0.12, 0.12, 0.12),
        });
        currY -= 11.5;
      }

      return currY - 2;
    } else {
      return drawWrappedText(page, bodyText, bodyX, currentY, maxWidth, size, fontRegular, rgb(0.12, 0.12, 0.12), 11.5) - 1.5;
    }
  }

  // --- SECTION: OBJECTIVE ---
  y = drawSectionHeader(page1, 'OBJECTIVE', y);
  const objectiveText =
    'Detail-oriented Data Analyst with hands-on experience in Python, SQL, Power BI, and Excel for data cleaning, data analysis, data validation, and dashboarding. Proven ability to automate data preparation and reporting workflows, track KPIs, perform exploratory data analysis (EDA), and deliver data-driven insights that support business decision-making.';
  y = drawWrappedText(page1, objectiveText, marginX, y, contentWidth, 8.8, fontRegular, rgb(0.12, 0.12, 0.12), 12);
  y -= 4;

  // --- SECTION: SKILLS ---
  y = drawSectionHeader(page1, 'SKILLS', y);
  y = drawBulletItem(page1, 'Programming & Analysis: ', 'Python (Pandas, NumPy, Matplotlib), SQL (MySQL, Joins, Aggregations, Subqueries, GROUP BY, CASE WHEN)', y);
  y = drawBulletItem(page1, 'BI & Tools: ', 'Power BI (DAX, Power Query, Data Modeling, Dashboards, Data Visualization), MS Excel (Pivot Tables, VLOOKUP, Data Validation, Data Visualization)', y);
  y = drawBulletItem(page1, 'Data Analysis: ', 'Data Cleaning, Data Transformation, Data Validation, Data Quality, EDA, KPI Tracking, Reporting, Statistical Analysis', y);
  y = drawBulletItem(page1, 'Data Visualization: ', 'Power BI Dashboards, Interactive Dashboards, Data Visualization, KPI Reporting', y);
  y = drawBulletItem(page1, 'Machine Learning: ', 'Regression, Classification, Model Evaluation (Basics)', y);
  y -= 4;

  // --- SECTION: EDUCATION ---
  y = drawSectionHeader(page1, 'EDUCATION', y);

  // MCA
  page1.drawText('•', { x: marginX + 8, y, size: 8.8, font: fontBold });
  page1.drawText('Master of Computer Applications (MCA)', { x: marginX + 18, y, size: 8.8, font: fontBold });
  page1.drawText('2023 – 2026', { x: pageWidth - marginX - fontRegular.widthOfTextAtSize('2023 – 2026', 8.8), y, size: 8.8, font: fontRegular });
  y -= 11.5;
  page1.drawText('Dr. Preeti Global University, Shivpuri, Madhya Pradesh, India', { x: marginX + 18, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  y -= 13;

  // BA
  page1.drawText('•', { x: marginX + 8, y, size: 8.8, font: fontBold });
  page1.drawText('Bachelor of Arts (BA)', { x: marginX + 18, y, size: 8.8, font: fontBold });
  page1.drawText('2020 – 2023', { x: pageWidth - marginX - fontRegular.widthOfTextAtSize('2020 – 2023', 8.8), y, size: 8.8, font: fontRegular });
  y -= 11.5;
  page1.drawText('Chhatrapati Shahu Ji Maharaj University, Kanpur, India', { x: marginX + 18, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  y -= 14;

  // --- SECTION: PROFESSIONAL EXPERIENCE ---
  y = drawSectionHeader(page1, 'PROFESSIONAL EXPERIENCE', y);

  // Role 1: Helpdesk Executive | 1Point1 Solutions
  page1.drawText('Helpdesk Executive | 1Point1 Solutions (ICEGATE Process)', { x: marginX, y, size: 9, font: fontBold });
  page1.drawText('Feb 2026–Present', { x: pageWidth - marginX - fontRegular.widthOfTextAtSize('Feb 2026–Present', 9), y, size: 9, font: fontRegular });
  y -= 12;
  y = drawBulletItem(page1, '', 'Resolved customer queries and service requests while maintaining accurate records of issues, interactions, and resolutions.', y);
  y = drawBulletItem(page1, '', 'Tracked tickets, follow-ups, escalations, and resolution status to ensure timely issue closure and SLA adherence.', y);
  y = drawBulletItem(page1, '', 'Maintained operational data using MS Excel and internal systems to support reporting, data accuracy, and performance tracking.', y);
  y -= 2;

  // Role 2: Data Tool Developer | Aashi Realty
  page1.drawText('Data Tool Developer | Aashi Realty', { x: marginX, y, size: 9, font: fontBold });
  page1.drawText('Jun 2025–Aug 2025', { x: pageWidth - marginX - fontRegular.widthOfTextAtSize('Jun 2025–Aug 2025', 9), y, size: 9, font: fontRegular });
  y -= 12;
  y = drawBulletItem(page1, '', 'Automated data cleaning and reporting pipelines using Python (Pandas, openpyxl), reducing manual effort by 50%', y);
  y = drawBulletItem(page1, '', 'Developed DataBook, a Python-based tool to clean and standardize messy CSV datasets', y);
  y = drawBulletItem(page1, '', 'Built Power BI data visualization dashboards for YoY growth and pricing insights', y);
  y = drawBulletItem(page1, '', 'Worked with business teams to define KPIs and improve reporting accuracy', y);
  y -= 2;

  // Role 3: Data Analyst Intern | Limbhas & Associates
  page1.drawText('Data Analyst Intern | Limbhas & Associates', { x: marginX, y, size: 9, font: fontBold });
  page1.drawText('Nov 2024–Feb 2025', { x: pageWidth - marginX - fontRegular.widthOfTextAtSize('Nov 2024–Feb 2025', 9), y, size: 9, font: fontRegular });
  y -= 12;
  y = drawBulletItem(page1, '', 'Prepared an Expense Tracker using Python and SQL for automated reporting', y);
  y = drawBulletItem(page1, '', 'Performed data validation and analysis using Excel and SQL, improving accuracy by 30%', y);
  y = drawBulletItem(page1, '', 'Created visual reports tracking project timelines, budget utilization, and resources', y);
  y -= 4;

  // --- SECTION: PROJECTS (Starts on Page 1) ---
  y = drawSectionHeader(page1, 'PROJECTS', y);

  // Project 1: DataBook
  page1.drawText('DataBook – Data Cleaning Tool', { x: marginX, y, size: 9, font: fontBold });
  const p1Tech = ' (Python, Pandas, NumPy, Openpyxl)';
  page1.drawText(p1Tech, { x: marginX + fontBold.widthOfTextAtSize('DataBook – Data Cleaning Tool', 9), y, size: 9, font: fontItalic, color: rgb(0.2, 0.2, 0.2) });
  y -= 12;
  y = drawBulletItem(page1, '', 'Automated cleaning and standardization of CSV/TXT files', y);
  y = drawBulletItem(page1, '', 'Reduced data preparation time by 70%', y);
  y -= 2;

  // Project 2: Real Estate Price Dashboard
  page1.drawText('Real Estate Price Dashboard', { x: marginX, y, size: 9, font: fontBold });
  const p2Tech = ' (Power BI, MS Excel)';
  page1.drawText(p2Tech, { x: marginX + fontBold.widthOfTextAtSize('Real Estate Price Dashboard', 9), y, size: 9, font: fontItalic, color: rgb(0.2, 0.2, 0.2) });
  y -= 12;
  y = drawBulletItem(page1, '', 'Analyzed real estate data for 5 cities', y);
  y = drawBulletItem(page1, '', 'Developed interactive dashboards showing price trends and YoY growth', y);


  // --- PAGE 2 ---
  const page2 = doc.addPage([pageWidth, pageHeight]);
  let y2 = pageHeight - 45;

  // Project 3: SCORPIO
  page2.drawText('SCORPIO – AI Desktop Virtual Assistant', { x: marginX, y: y2, size: 9, font: fontBold });
  const p3Tech = ' (Python, Flask, SpeechRecognition, NLP, Automation)';
  page2.drawText(p3Tech, { x: marginX + fontBold.widthOfTextAtSize('SCORPIO – AI Desktop Virtual Assistant', 9), y: y2, size: 9, font: fontItalic, color: rgb(0.2, 0.2, 0.2) });
  y2 -= 12.5;
  y2 = drawBulletItem(page2, '', 'Built a Python-based voice-controlled desktop assistant that processes spoken commands to perform system operations, file management, web searches, internet-based tasks, and other automated actions.', y2);
  y2 = drawBulletItem(page2, '', 'Implemented SpeechRecognition and basic NLP-based command processing to interpret user instructions and execute predefined desktop and utility operations.', y2);
  y2 = drawBulletItem(page2, '', 'Integrated capabilities for basic conversational interaction, Google/web search, translation, and task automation through command-driven Python modules.', y2);
  y2 -= 3;

  // Project 4: AetherFinance
  page2.drawText('AetherFinance – AI Personal Finance Tracker', { x: marginX, y: y2, size: 9, font: fontBold });
  const p4Tech = ' (HTML, Tailwind CSS, JavaScript, Three.js, Gemini API, Python)';
  page2.drawText(p4Tech, { x: marginX + fontBold.widthOfTextAtSize('AetherFinance – AI Personal Finance Tracker', 9), y: y2, size: 9, font: fontItalic, color: rgb(0.2, 0.2, 0.2) });
  y2 -= 12.5;
  y2 = drawBulletItem(page2, '', 'Developed a futuristic AI-powered personal finance application for expense tracking, spending analysis, budgeting, and savings management.', y2);
  y2 = drawBulletItem(page2, '', 'Integrated the Gemini API and Python to provide conversational financial assistance, personalized spending insights, money-saving tips, and analysis of high-spending categories and expenses.', y2);
  y2 = drawBulletItem(page2, '', 'Built interactive financial visualizations using Three.js and implemented budget tracking, savings goals, transaction analysis, and smart spending notifications.', y2);
  y2 = drawBulletItem(page2, '', 'Designed a responsive fintech interface using HTML, Tailwind CSS, and JavaScript with interactive dashboards and financial analytics.', y2);

  // Live link
  page2.drawText('Live: aetherfinance-app.ai.studio', {
    x: marginX,
    y: y2,
    size: 9,
    font: fontRegular,
    color: rgb(0.15, 0.15, 0.15),
  });
  y2 -= 18;

  // --- SECTION: CERTIFICATIONS ---
  y2 = drawSectionHeader(page2, 'CERTIFICATIONS', y2);
  const certs = [
    'Data Analysis (Top 10%) – TestDome',
    'Data Analysis (Top 25%) – TestDome',
    'micro1 AI Interview Certification – Outstanding Performance',
    'Advanced Excel for Job & Real World – Udemy',
    'Python Programming – Aptech Learning, Gurugram',
    'Java Programming – Aptech Learning, Gurugram',
    'Hands-On Python Data Science – Udemy',
  ];
  certs.forEach((cert) => {
    y2 = drawBulletItem(page2, '', cert, y2);
  });
  y2 -= 8;

  // --- SECTION: LANGUAGES ---
  y2 = drawSectionHeader(page2, 'LANGUAGES', y2);
  page2.drawText('•', { x: marginX + 8, y: y2, size: 9, font: fontBold });
  page2.drawText('English (Professional)', { x: marginX + 18, y: y2, size: 9, font: fontRegular });
  page2.drawText('•', { x: marginX + 140, y: y2, size: 9, font: fontBold });
  page2.drawText('Hindi (Professional)', { x: marginX + 150, y: y2, size: 9, font: fontRegular });

  // Save PDF
  const pdfBytes = await doc.save();
  fs.writeFileSync('public/Shivanya_Mishra_Resume.pdf', pdfBytes);
  fs.writeFileSync('public/resume.pdf', pdfBytes);
  console.log('Resume PDF generated successfully at public/Shivanya_Mishra_Resume.pdf and public/resume.pdf');
}

generateResume().catch(console.error);
