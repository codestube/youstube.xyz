$(document).ready(function() {
    // Only initialize terminal if element exists
    if ($('#terminal').length === 0) {
        return;
    }
    
    const commands = {
        help: function() {
            this.echo('Useful commands:\n');
            this.echo('  [[b;#58a6ff;]about]     - who I am');
            this.echo('  [[b;#58a6ff;]work]      - what I build');
            this.echo('  [[b;#58a6ff;]writeups]  - CTF notes and blog posts');
            this.echo('  [[b;#58a6ff;]contact]   - links and email');
            this.echo('  [[b;#58a6ff;]clear]     - reset this screen\n');
        },
        about: function() {
            this.echo('[[b;#f778ba;]youstube]');
            this.echo('=====================================');
            this.echo('Developer, Security Enthusiast, Problem Solver\n');
            this.echo('I\'m passionate about creating efficient, scalable,');
            this.echo('and maintainable software solutions. I love tackling');
            this.echo('complex challenges and turning them into elegant solutions.\n');
            this.echo('Interests:');
            this.echo('  • Full-stack Development');
            this.echo('  • Cybersecurity & CTF Competitions');
            this.echo('  • Open Source Contribution');
            this.echo('  • System Architecture & Design\n');
        },
        work: function() {
            this.echo('[[b;#f778ba;]Work]');
            this.echo('=====================================\n');
            this.echo('[[b;#58a6ff;]Security:] Web exploitation, CTFs, writeups');
            this.echo('[[b;#58a6ff;]Development:] JavaScript, Python, Node.js');
            this.echo('[[b;#58a6ff;]Frontend:] HTML, CSS, React-style interfaces\n');
            this.echo('[[b;#58a6ff;]Portfolio Website]');
            this.echo('  A lightweight, terminal-based portfolio');
            this.echo('  Tech: Eleventy, jQuery Terminal\n');
            this.echo('[[b;#58a6ff;]CTF Writeup Archive]');
            this.echo('  Platform for sharing CTF writeups and solutions');
            this.echo('  Tech: Static site generation\n');
        },
        contact: function() {
            this.echo('[[b;#f778ba;]Contact Information]');
            this.echo('=====================================\n');
            this.echo('[[b;#58a6ff;]Email:]     [[!;;]youstube@flagaholic.xyz]');
            this.echo('[[b;#58a6ff;]GitHub:]    [[!;;]https://github.com/codestube]');
            this.echo('[[b;#58a6ff;]X:]         [[!;;]https://x.com/codestube]');
            this.echo('[[b;#58a6ff;]Instagram:] [[!;;]https://instagram.com/youstube__]\n');
        },
        writeups: function() {
            this.echo('[[b;#f778ba;]CTF Writeups & Blog]');
            this.echo('=====================================\n');
            this.echo('Open [[!;;][[bu;#58a6ff;]/writeups/]] for CTF writeups and longer technical posts.\n');
        },
        clear: function() {
            this.clear();
        }
    };

    $('#terminal').terminal(commands, {
        greetings: '[[b;#f778ba;]youstube terminal]\n' +
                   'Type \'[[b;#58a6ff;]help]\' to see available commands.\n',
        prompt: '[[b;#58a6ff;]youstube@terminal][[b;#ffffff;]:][[b;#a371f7;]~][[b;#ffffff;]$] ',
        checkArity: false,
        exit: false,
        clear: false,
        height: '100%',
        scrollOnEcho: true,
        completion: Object.keys(commands)
    });
});
