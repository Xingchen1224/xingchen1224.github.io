// CV content, shared by the CV page and the standalone HTML export so the two
// can never drift apart.
export const CV = {
  now: 'Now leading a team of AI agents — efficiently driving multiple projects from zero to one, and quickly optimizing existing ones.',
  before: 'Image algorithms R&D engineer and technical project leader, taking algorithms from prototype to production.',
  // The last row is the toolbox: kept, but deliberately quieter than the rest.
  skills: [
    { title: 'AI collaboration', body: 'Running several agents and tools in parallel, delegating clearly, and reviewing at the key checkpoints so speed never costs quality.' },
    { title: 'Vision', body: 'Seeing where a product should go and the niche it holds in its ecosystem — then choosing what to build, and what to leave out.' },
    { title: 'Reflection', body: 'Looking back on what worked and what did not, and feeding it into how I and the agents work next time.' },
    { title: 'Foundations', body: 'Image algorithms, computer vision, computational imaging · C++, Python, OpenCV, JUCE, CMake, Git', quiet: true },
  ],
  interests: [
    { title: 'Data', body: 'Macroeconomic data and the financial reports of companies I’m interested in.' },
  ],
} as const;

export const CV_HTML_PATH = '/xingchen-wang-cv.html';
export const CV_PDF_PATH = '/xingchen-wang-cv.pdf';
