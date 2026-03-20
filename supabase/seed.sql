-- Seed data from current portfolio
-- Run after 001_initial_schema.sql

-- About Me
INSERT INTO about_me (content, tech_list) VALUES (
  'Hello! I''m a passionate and detail-oriented web developer with a flair for crafting engaging and responsive websites. With a strong foundation in front-end technologies like HTML, CSS, and JavaScript, coupled with expertise in popular frameworks and libraries, I specialize in creating seamless user experiences.

Whether it''s building visually appealing interfaces or optimizing back-end functionality, I am dedicated to delivering high-quality, performance-driven web solutions.

I thrive on staying up-to-date with the latest industry trends and technologies to ensure that the websites I develop not only meet but exceed modern standards. Let''s collaborate to turn your web development vision into a reality!

Here are a few technologies I''ve been working with recently:',
  '["JavaScript (ES6+)", "React", "Tailwind", "Node.js", "Mongo DB", "React Native"]'::jsonb
);

-- Experience
INSERT INTO experience (j_no, name, position, time_period, description, sort_order) VALUES
(2, 'Asiana Times', 'Graphic Design Intern', 'Nov 2022 - Dec 2022', ARRAY[
  'Created posters for news articles using canva.',
  'Created illustrations and slides for various teaching sessions hosted by club members using Adobe Illustrator',
  'Created templates for social handles.',
  'Gained experience in working within a team environment and effective communication'
], 0),
(1, 'Google Developer Student Clubs- GU', 'Graphic Design Lead', 'Sep 2022 - Aug 2023', ARRAY[
  'Created posters for various events online using canva.',
  'Created illustrations and slides for various teaching sessions hosted by club members using Adobe Illustrator',
  'Created templates for social handles.',
  'Gained experience in working within a team environment and effective communication'
], 1);

-- Projects
INSERT INTO projects (name, description, img, tech_used, git_link, link, sort_order) VALUES
('Zaika - Food Delivery Platform 🚀', 'I developed an interactive UI with React Hooks, Redux, and reusable components for efficient state management and code reusability. Performance was optimized with bundlers, Babel, dynamic UI, and code splitting, while leveraging features like functional components, props & state, React Router, and React Testing Library to ensure scalability and testability.', '/images/zaika.png', ARRAY['React Js', 'Tailwind', 'Mongo DB', 'Vercel'], 'https://github.com/utkarshsingx/Zaika', 'https://zaika-kitchen.netlify.app/', 0),
('ALGORITHM VISUALISER', 'I implemented 4+ pathfinding algorithms, including Dijkstra''s, A*, BFS, DFS, and Greedy Best-first Search, in a web app built with React using HTML5, CSS3, and JavaScript for a smooth user experience. I also integrated a Recursive Division Maze Generation algorithm, creating complex mazes and showcasing proficiency in algorithm design and complexity management.', '/images/algo_visualiser.png', ARRAY['HTML', 'CSS', 'Javascript'], 'https://github.com/utkarshsingx/Algorithms-Visualiser', 'https://codeslayer-algorithm-visualiser.netlify.app/', 1),
('Design Portfolio Website', 'Check out my design portfolio! Made with HTML, CSS, and JavaScript, spiced up with GSAP animations for that extra flair. Dive into a mix of creativity and tech, explore cool projects, and enjoy a smooth, eye-catching experience that showcases my design passion!', '/images/design_portfolio.png', ARRAY['HTML', 'CSS', 'Javascript', 'GSAP', 'Vercel'], 'https://github.com/utkarshsingx/design-portfolio-website', 'https://codeslayer-design.netlify.app/', 2);

-- Contact
INSERT INTO contact (section_title, body_text, cta_label, cta_url) VALUES (
  'Get In Touch',
  'Feel free to reach out! I''m currently open to new freelancing projects and eager to explore exciting opportunities. Let''s connect and discuss how we can collaborate on innovative and impactful ventures. Looking forward to hearing from you!',
  'Say Hello!',
  'https://www.linkedin.com/in/utkarsh-singh-0b9090227/'
);

-- Links
INSERT INTO links (type, url, sort_order) VALUES
('github', 'https://github.com/utkarshsingx', 0),
('twitter', 'https://twitter.com/utkarshsingx', 1),
('linkedin', 'https://www.linkedin.com/in/utkarsh-singh-0b9090227/', 2),
('email', 'mailto:hauntedutkarsh@gmail.com', 3);

-- Resume (placeholder - update after upload)
INSERT INTO resume (file_url, file_name) VALUES ('/UtkarshResume.pdf', 'UtkarshResume.pdf');

-- Site sections
INSERT INTO site_sections (key, enabled, sort_order) VALUES
('about', true, 0),
('experience', true, 1),
('contributions', true, 2),
('projects', true, 3),
('contact', true, 4);
