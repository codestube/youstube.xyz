---
layout: post.njk
title: "After thoughts of org-ing my first (internal) CTF"
description: "holicCTF v1 post-mortem"
tags: archivePost
contentType: blog
date: 2026-08-18
permalink: /posts/holicctf-v1-postmortem/index.html
templateEngineOverride: md
---

# My first CTF org'ed!! (Internally)

Hai!! If you don't know who I am, I'm youstube, the leader of [flagaholic](https://flagaholic.xyz) :agahi:. Recently (like a month ago), I have planned, designed, hosted, organized my first ever Capture The Flag event, unofficially named holicCTF v1 (internal), and there's a lot of things I want to uncover / write down to share my two-cent on CTF as of recently and **how I plan to change the scene**, as well as some things that have happened during the event.  
<small>[if you are here for the drama on us banning pavel (pavel_edits), click here to read](#the-drama)</small>

![holicCTF-scoreboard](/posts/holicctf-v1/scoreboard.png)  
<small>the only reason the graph looks like that is because I forgot to add points for a special reason :skulk:</small>

## Disclaimer on my standpoint for CTF

First off to make things clear, I am in no position to say that CTF is dead. I am purely a newbie in the scene of CTF (1.5y as of right now) and I don't have as much experience as those OGs talking about the downfall of CTF or how agentic LLMs ruined CTF blahblahblah. My opinions are purely based on what I have gathered from my own experience and some of my peers. ***In my honest opinion, CTF is purely dead for people that plays it for prize and top position.*** I am part of the aforementioned problem <small>(slopped a lot in past CTF, will write a blog on how I won one of them in the future)</small>, but I still enjoy the general aspect of solving puzzle and be rewarded for it in CTFs, and have since taken a different idealism on playing CTF. With that out of the way, let's talk about holicCTF v1 :D

## The born of (internal) holicCTF v1

After playing CTF for a year, and watching all the terrible CTFs our team has endured, I had the idea of hosting our own for funzies. However at the time, CTF has heated debates on whether it is dying or not. Personally I viewed this as an opportuinty to revamp CTF as a whole, where the core idea of jeopardy stays, but part of its mechanics are changed. The idea came to me while I was on the way to a CTF prizing ceremony actually (PolyU Nuttyshell CTF 2026), and I roughly mentioned it to some of my teammates. Most of them laughed it off, saying it's definitely an unorthodox idea, but I was serious to make this happen since it'll be the **WORLD'S FIRST EVER** CTF that had these ideas, and I was the one orchestrating it.

Now I know what you're thinking, that's a pretty big claim, can you back it up? <small>that's probably not what youre thinking, more like "what great ideas has this mastermind came up with?"</small>

1 term: **NSFW**. yes. NSFW challenges.  
![nsfw-challs](/posts/holicctf-v1/nsfw-challs.png)

Now before you go to X <small>(formerly known as Twitter)</small> and write about how bad of an idea this is, get millions of retweets, just give me some time and hear me out. It is for AI-proofing, or at least that's what I thought... (definitely not foreshadowing)

I had another idea that is also unique and never been done before: **Everyone is an author**, meaning you as the participant can also upload challenges you've written and upload it to our CTFd infra via our Discord bot! (apparently this is similar to something [HITCON CTF 2025](https://youtu.be/BOKXFglC5ZU?t=247) did but not quite, <small>kudos to `Nelson` for letting me know</small>). This introduced a very special challenge made by our teammate `Laggy`, which I'll get to later, but keep this name in mind for now!  
![author-msg](/posts/holicctf-v1/upload-chall-msg.png)

This two ideas / changes are what made holicCTF v1 (internal) the **WORLD'S FIRST EVER** unique CTF to ever be hosted, even though it was internal. Although there were some hiccups during the design part that ultimately led to a week of delay for the CTF (i hate you SISUBENY), we did end up ~~vibe~~coding of the implementations and organizing this CTF.

## Some prologue on the CTF

holicCTF v1 was a 1-week long CTF, held internally within our team members and some players that I personally invited (including pavel?!, AgentPerry, tienxion. (didn't join), wylited (didn't join) & Multiflora_Rose). This was not held publicly due to 3 reasons:

- the CTFd infra and instance-based challenges server were hosted in a VM running Ubuntu Server in my local Mac Mini ~~stolen~~ borrowed from my previous institute, meaning I can't afford it being pwned or resource-hungry for instance-based challs. the bot on my Discord server is also hosted with Docker on the Mac Mini itself. All this points to each and every connections were to my home network.
- since this is my 1st ever org'd CTF, with responsiblity of managing the infra + hosting the challenges + hot-fixing issues, I wanted to minimize the coverage and damage it could cause and opt to gather reviews / knowledge of hosting a CTF before hosting a public one, as I do not think I have the capability yet to manage a player-based CTF of over 100 players-
- This is even worse when many CTF players nowaday just don't read the fucking rules and just wants to win to flex on LinkedIn or their personal site. The sheer amount of management needed for the absolute tomfoolery playerbase the current state of CTF has is not 1 or even 5 can handle, at least not for me and my staff team. I mean just look at how many teams are getting banned / ban-evading on recent CTFs.

By those reasons, I've decided to just make this an internal one. I also invited these players because I know that they have integrity when it comes to CTFs (<small>subtle foreshadowing</small>), and they more or less have played CTF for ~1y.

## Details on the CTF

This CTF has 3 features that were never done before:

1. All players are authors;
2. Rating system for challenges;
3. NSFW Challenges.

### Authoring
Let's start with the authoring part. All players from this CTF is an author, meaning as long as you have a challenge that wants to be put up onto the jeopardy board, you can use our easy-to-navigate-and-totally-bug-free Discord form via the Discord bot.  
![discord-form](/posts/holicctf-v1/discord-form.png)  
You can choose the category (where GeoInt required you to put coordinates instead), difficulty (how much points the challenge should be), or even have it be hosted on our backend for you if you don't have a server to run the instance. All non-instance-based challenges are immediately uploaded to our infra and will announce a message in the Discord channel letting people know that there is a new challenge just dropped (only if you opt to ping).  
![chall-announce](/posts/holicctf-v1/chall-announce.png)  
All challenges flag hashes immediately into **MD5**, and the original is thrown away immediately, with 0 logs kept, meaning I (the one hosting the bot) can't even get to know what the flag may be. This is also the same when I log into the CTFd backend when I need to adjust some challenges info. <small>you can also check this at [our challenge repo](https://github.com/Flagaholic/holicCTF-internal-2026-v1-challenges/tree/main/socint/weird-view)</small>  
[md5-backend](/posts/holicctf-v1/md5-backend.png) 
Additionally, if you want us to help you host an instance-based challenge, you'll have to provide us with enough files such that we can do the hosting on our end. That means the public file (for players), the private files (for hosting the chal), the Dockerfile (for spinning an image up). This will then go to our staff-side review channel, where our staffs (mostly me) will do a quick analysis on the Dockerfile to check if there's any malicious intent with the Dockerfiles (since that can RCE the server if I don't double check it). <small>ignore the error message I couldn't find an original one</small>  
![bot-upload-message](/posts/holicctf-v1/bot-message.png)  
For this step, I also integrated a prompt command for my codex `$instance-review` and it just checks all the codes (skims out on the flag) and check slightly if there are any obvious attacking / malintent code that is trying to do funny stuffs on the challenges.  

### Rating System
This to me is a very special one. I feel like a lot of functionalities in CTFd is often overlooked and underused. One of them being the default rating system, where once a player solves a challenge, they can give it a "thumbs up" or a "thumbs down", and optionally giving some comments directly to the CTFd backend. This is so frustrating to use since it has 2 main issues:  
1. It's fundementally flawed
   + When you exit out the challenge card, the prompt disappears
   + You can only rate it "Good" or "Bad". No neutral
2. It's complicated
   + Authors has to log the backend to see ratings
   + Even so, a "thumbs up" or "thumbs down" just means nothing to an author

That's why I've decided to rework it into a reward-like system, where it also kinda works with the authoring system.  
![rating-system](/posts/holicctf-v1/rating-system.png)
***The first thing*** I did is change from thumbs up and down to a scale from 1 to 10, better depicting a challenge if it's neutral/good/bad/horrible/amazing. It also changes the way people look at a challenge after solving. I also fixed the bug (or a feature) where the player had to re-solve the challenge in order to see the rating system again.  
***The second thing*** was the way to display the rating, which is just taking the average of the overall ratings and putting it as X.Y/10.0 (Z ratings). These 2 things already made it more understandable for players to know if this challenge is hard due to bad chall or skill issue.  
***The third thing*** was the rating leaderbaord, a lb that displays which challenge has the highest weighted rating overall. Here I used the [Bayesian average](https://en.wikipedia.org/wiki/Bayesian_average) to find out the overalls to not have 1 10/10 rating be overtaking a challenge with 9 ratings of avg 9.5/10.  
![rating-leaderboard](/posts/holicctf-v1/rating-leaderboard.png)  
With this I also try to motivate other players to be an author of good challenges as well. The top 10 highest rated challenges will each get extra points (<small>hence the leaderboard graph being so delayed cuz i forgot</small>), with 1st getting 1,000 points, 2nd getting 900, 3rd is 800 and so on. So it also acts as a reward system!

### NSFW Challenges (sigh it's not what you think it is)

Before you get rowdy and starts sending me threats on Discord: It is **NOT** a category full of porn. It is an OSINT category, but with contents that aren't very family-friendly. There are no files containing porn, sexual, gore, or any type of adultery content in all these challenges. The disclaimer I've made for this challenge should at least summarize what this category is to players.  
![nsfw-disclaimer](/posts/holicctf-v1/nsfw-disclaimer.png)  
I made this category with a few intentions, one of the major one is to stop instant agentic solving challenges. I really wanted to make some file-based challenges (meaning not just OSINT) that contains extreme censorship words against agents such that it totally blocks people from just shoving it to AI (perhaps flagging their account on accident hehe), but I did not end up with any good ideas that could work without people just stripping the contents / changing the string values.  
![nsfw-challs](/posts/holicctf-v1/nsfw-challs.png)  
All these challenges are pure description. The path you take when solving these will have a chance of viewing some obscene contents, but from my official solve path I did not encounter any, meaning it's totally avoidable. To reiterate, only the description / what you're searching for contain PG-rated languages, that's the NSFW part.  

Another intention was the category function in CTFd, where you categorize different people to seperate them from division. It really doesn't serve another purpose. So I re-designed it such that `Uncs` (>= 18yo) and `Babies`(< 18yo), and making NSFW category only be accessible to `Uncs` only, giving the category function another usage of locking challs behind them. You can use this to perhaps change challenge difficulty for various players like Beginner/Advanced/Professional, and make the game more diverse with various difficulty of challenges shown to specific divisions only.  

Overall I really liked this category considering the amount of reviews I received from various players (and the drama), as well as doing some unorthodox things to make this CTF a special one :kekw:

<details>
<summary>
  Here are some <small>minor</small> things we kinda messed up with these designs
</summary>

1. GeoINT chall  
   - Remember how all flags are hashed with md5? well... all our GeoINT challs were submitted with coordinates and a OSM map using [geo_challenges created by degun-osint](https://github.com/degun-osint/geo_challenges). There was no flags for these challenges.
   - If you go to the backend of these GeoINT challs, it'll show the exact coordinates of the solution. These were not blocked because I couldn't think of a way to be able to not see the locations, and modify the location if it's wrong.
   - It is also quite hard to view the range of the challenge for the author if it's really tight or wide without seeing the answer.
2. Instance-based upload
   - this is exceptionally difficult to implement. on one hand if this was a bigger CTF, with more "authors", it is more prone to human error like forgetting to set FLAG env, forgetting files; meaning more manual labour of reviewing will be needed and staff (which are players as well) might accidentally unveil the flag to themselves and be in a paradox of not solving the chall but knowing the flag;
   - on another, malicious "authors" may increase and relying on my Codex to review them will always have the probability of missing one, therefore slipping one into my infra. I really don't want that to happen, so I've already set all challenge to have no outbound connection (unless given permission to). but that really defeats the purpose if we chose not to trust the "authors"
   - with no outbound connection, many challenge ideas were not possible like SSRF, XSS, Reverse Shells... still aren't sure how to combat this issue without restricting too much 
3. Sharing admin account to staff
   - This is a pretty big problem. During the CTF I did not give the admin account to staff due to "decentralization". This made my workload entirely on me, including announcement notifs, flag changes, description changes, chall deletion, submission removal, and everything else.
   - This wasn't a big deal for this internal CTF since it wasn't a lot of player, but if this was a public one, I'd die :skull:
   - I know I probably shouldn't have bear the entire responsibility on me, and shared the account to the staff and trusted them more... idk decentralization go brr
4. infra. the biggest problem of all
   - like hosting this whole ctf on a ubuntu vm on a mac mini is ideal because it's internal and have a concurrent playerbase traffic of 5/hr. but imagine this was a public one :sob:
   - I was conflicting on whether hosting a server somewhere to host the challenges, but to set up Codex, CTFd, Whale, and everything on a server somewhere that could have immense ping problem annoyed me
   - i did however felt I had more control hosting this locally, but it's not really that big of a feat.

</details>

## <span id="the-drama">The drama</span>
If you skipped everything and read this part first, I don't blame you, but for some context I invited several trusted CTF players to play this internal CTF for gathering reviews on my changes in general, one of them being `pavel?!`, a very well-known CTF player in the community leading the team `THEM?!`. I invited him because I know that he has played several CTFs, is a CTF leader of one of the top teams in the world, and I wanted to get his opinion on the changes / mechanics I've made for this internal CTF.  

To make things clear once again, this CTF does not have **ANY PRIZES AT ALL**, meaning we hosted this only for funzies and feedbacks from players so that we know if the things we added are a viable addition to future CTFs we host. The point of this CTF is to try make CTFs more fun and engaging to play, instead of slopping challenges for prizes and fame.  

We have explicitly made a rule telling people not to slop any challenges.  
![rule-5](/posts/holicctf-v1/rule-5.png)  
Now for the 4th sub-point, I'd step forward and say I've asked a player or two on how they solved a challenge to prove their legitimacy on not slopping due to suspicion, but lwk I just forgot this sub-rule :skull: Anyhow this isn't that important  

The funny thing was, someone actually telling me that they like the format, which I appreciated. However out of nowhere when asked about the unique NSFW challs, he explicitly said he slopped the challenges... in which I did not even force that information out of him. He just said it. and that someone is none other than pavel himself.  

![chatlog-1](/posts/holicctf-v1/chatlog-1.png)  
![chatlog-2](/posts/holicctf-v1/chatlog-2.png)  
![chatlog-3](/posts/holicctf-v1/chatlog-3.png)  

Since he asked to remove his solves, and said only slopped my NSFW challs, we ran a poll on whether he should be banned or just remove his solves in the announcement channel:  
![poll](/posts/holicctf-v1/poll.png)  
in the early phases, this poll was leaning towards removing his solves, because some of our members truly believe that he's just slopping the NSFW challs, and not other challenges, so removing his solves was enough for the cause. Until we found more evidence of him slopping smh...  
![chatlog-4](/posts/holicctf-v1/chatlog-4.png)
<small>we'll get back to this chall mentioned above later... </small>  
![chatlog-5](/posts/holicctf-v1/chatlog-5.png)
for some context: the 1st part of the flag for `forensics/lightning mcqueen!` is a viewed flag, where you have to carve out the .usdc part of a file and view the first part on a lightning mcqueen's hood. slopping will not get you the flag because the flag is not even readable for human solvers (the use of 1/i/I/l). that's why most attempts for lightning mcqueen! is very close to each other like `holic{1_w1n...` or `holic{I_w1n...` or `holic{l_wIn...`, and never `holic{;-)...` or whatever he tried. In addition, it is absolutely illogical for a frequent CTF player to "guess" the 1st part of the flag w/o finding the opener `holic{` when the 2nd part of the flag had the `}` closing parenthesis. You could definitely say I didn't have absolute certainty of saying that he slopped the first part... but let's go back to the chall I said we'll get back to: `rev/entropy`  
![entropy](/posts/holicctf-v1/entropy.png)  
`rev/entropy` was a troll rev chall made by our very funny teammate [Laggy](https://github.com/ALaggyDev), he simply js randomly wrote a file w/ random bytes, with no flag in it, and published it as a rev challenge. this was never planned and we never discussed to do such a heinous act, so all idea was Laggy his own. looping back to the previous chat msgs, guess who fell for this bait chall? :D

![laggy-dm-1](/posts/holicctf-v1/laggy-dm-1.png)  
![laggy-dm-2](/posts/holicctf-v1/laggy-dm-2.png)  
![laggy-dm-3](/posts/holicctf-v1/laggy-dm-3.png)  
![laggy-dm-4](/posts/holicctf-v1/laggy-dm-4.png)  

so yeah... he was finding "TempleOS", "Vocab.DD", "terry_davis" out of nothing. While this isn't definitive proof like the NSFW chall part, I hope we all can come to agree that what he's proposing in THIS chall was absolute nothing but larp from slopping. The worst part is him not admitting to it and continues to ":sob:" or "i guessed it", like come on bro.  

### Additional funny thing
This holicCTF v1 was a week long, with the final 2~ish day overlapping with L3akCTF. guess what happened there too :skull:  
![pavel-solved](/posts/holicctf-v1/pavel-solved.png)
insert vine boom sound  
![them-slop](/posts/holicctf-v1/them-slop.png)  
kudos to L3akCTF's team (and [Andyrew](https://ctf.snowbird91.xyz/) for org'ing L3akCTF and allowing me to cover this in the blog) with these more meticulous ways to catch sloppers like him. To not only slop at a unknown, fameless CTF like holicCTF v1, but to disrespect the rules of no-AI implemented by L3ak, arguably one of the top team in US (w glaze?) is genuine brainrot activity.

### my feelings
After all of these clown fiesta, I genuinely decided to just ignore him. I've given him chances to stop doing so, like telling him that slopping challs was not okay with the NSFW ones, but he continued his lies and ignored the rules that I've explicitly set (there was a rule quiz that you had to do to get access to the challenges btw to make sure you understood the rules), disregarded this **internal, prizeless, fameless, pure fun, only for feedbacks** CTF made by me and our team. Doing the same thing in a more prestigious CTF called L3akCTF is crazy as well. This was extremely disrespectful to me as the organizer, author, and his online friend as both leader of a CTF team.  

I initially respected him because on the surface he looked as if he was able to gather a bunch of players, and be able to maintain a HUGE community server, while having good placements in CTFs (and also pep talking to his teammates). I won't say I looked up to him, but he was someone I turned to when I was anxious about my team inactivity problem. To be able to uphold such an active community like THEM?! is no easy feat to be completely frank. Those are some of the reason I invited him (and maybe have him author some cryptos if he understands the authoring system), but now I really don't want to have any connection with him.  

Pavel if you're reading this, I know you have DM'd me a few times, but from the context of your words, you're still trying to make this about you. It was never about you, you disrespect **my challenges, my rules, my CTF, my creations** (so corny bro). I genuinely don't want to associate with someone that lies, manipulates, and as self-centered as you are. Please stop trying to make amends.  
![pavels-dm](/posts/holicctf-v1/pavels-dm.png)

## Closing words
This blog took me around 2 weeks to compose, I know wayyyyyyy too long, but I wanted to really demonstrate what I see in future CTFs. To make it a fun, exciting environment of not just playing jeopardy, but a fun puzzle game with various quirks and mechs for everyone to enjoy in this AI-heavily-bombarded era. My goal is to achieve [this blog's idealism written by Michael Debono (or mixy1) from OtterSec](https://osec.io/blog/save-ctfs-fund/#whats-the-solution), and make a certain impact on shifting CTF to something more fun then just solving challenges.  

I know I'm still a no-namer to many, a beginner or just a small fry in the CTF scene. However, I hope to be one of the figures to at least tried to change the CTF scene, and instead of having this constant heated debate of AI vs CTF, it's more debates of who made a game that's more fun.  

I might as well tell you this, holicCTF v2 is going to even more fun with a very very VERY special mechanic and some quirks! It is already under progress (like 1%), and I can't wait to have people react to the bizarre ideas that me and my teammates have come up! As this is the second CTF I org', and probably the first to go semi-public, I'm still deciding on whether to keep it locally (like only for Hong Kong players and a maybe few players that I trust (hopefully no pavel incident again)) or fully-public (post on CTFTime and allow world-wide players to participate). We'll see though, maybe no one will be interested at the end and it'll be a flop :sob:  

Anyhow, I'm humbly looking for some people for my next CTF:
- Sponsors mostly on infra
- Technical helper on implementations
- Infra advisor on... well infra
- Authors (maybe...?)  

If you are looking to sponsor prizes, I'll probably deny and have you keep it to yourself. I think having prizes in CTF introduces prize-hungry manipulative teams that just wants to win the prize and glory, which may introduce many unnecessary problems and drama in organizing. **I WILL MAKE AN EXCEPTION** if your prize (or just the idea) is unique, not just money or certificates or licenses! So do reach out if you REALLY want to. Discord @ youtubeshort or find me in most CTF servers :kekw:  

Anyway I'm getting ahead of myself, maybe only 2 people will read till here anyway. If you did read the entire thing, truly appreciate it. Feel free to reach out to let me know how this blog felt, or the overall vibe of the website, or just anything in general! I'd really love all the supports and critiques that I can get, and will remember it by heart and try to fix the flaws. Thank you everyone! <3  

\- youstube signing out xx