---
permalink: /
author_profile: true
stylesheets:
  - /assets/css/home.css
redirect_from: 
  - /about/
  - /about.html
---
<h1 class="main-heading">Hi there <img src="images/Hi.gif" width="40px"> Welcome to my Homepage!</h1>

About Me
---------------

Hi! I’m **Zhengxian Wu**, a third-year master’s student in the Artificial Intelligence program at **Tsinghua Shenzhen International Graduate School (Tsinghua SIGS)**. I am currently a member of the **Future Media Lab**. Before joining Tsinghua, I received my bachelor’s degree from **Hefei University of Technology**.

My research interests lie in **recursive self-improvement (RSI) systems** and the stability of agents performing long-horizon tasks. I am also exploring hybrid human–AI collaboration scenarios, including cowork-style tasks, as well as broader and more flexible forms of search. In addition, I am currently a Research Intern at **Ant Group**, where I work on multimodal search.

I am currently open to full-time opportunities and would be delighted to connect with people who share similar research interests. Please feel free to reach out to me at **[zx-wu24@mails.tsinghua.edu.cn](mailto:zx-wu24@mails.tsinghua.edu.cn)**!

News
---------------
<div class="news-box">
  <ul class="news-list">
    <li><span class="news-date"><em>2026.08</em></span> 🎉🎉 Three papers, including CSRS and DBAgent, were accepted to EMNLP 2026.</li>
    <li><span class="news-date"><em>2026.07</em></span> 🚀 We open-sourced SearchOS, a large-scale agent for broad information gathering.</li>
    <li><span class="news-date"><em>2026.07</em></span> 🎉🎉 One paper (ProMSA) was accepted to ECCV 2026.</li>
    <li><span class="news-date"><em>2026.06</em></span> 🎉🎉 One paper was accepted to a SIGIR 2026 Workshop.</li>
    <li><span class="news-date"><em>2026.03</em></span> 🎉🎉 One paper (UniPR) was accepted to CVPR 2026.</li>
    <li><span class="news-date"><em>2026.02</em></span> 🎉🎉 Two papers (R3G and PSGait) were accepted to ICASSP 2026.</li>
    <li><span class="news-date"><em>2025.11</em></span> 🎉🎉 One paper (LMGait) was accepted to AAAI 2026.</li>
    <li><span class="news-date"><em>2025.05</em></span> 🎉🎉 DAGait was selected for an oral presentation at ICME 2025.</li>
    <li><span class="news-date"><em>2025.03</em></span> 🎉🎉 One paper (DAGait) was accepted to ICME 2025.</li>
  </ul>
</div>

Experience
--------------

- **05/2026–Present**, Research Intern at **Ant Group**.
- **08/2025–03/2026**, Research Intern at **OPPO**.


Publications
--------------
<button class="pub-button active" onclick="filterPublications(event, 'all')">Core Publications</button>
<button class="pub-button" onclick="filterPublications(event, 'list')">Full Publications List</button>

(* equal contribution · &dagger; corresponding author · &Dagger; project leader)

<div id="core-publications" class="publication-view" data-publication-view="core">
<div class="publication-card" data-category="all"> 
  <div style="display: flex; align-items: center;">
    <div class="pub-media-rotator" data-interval="4000" style="position: relative; width: 320px; height: 180px; margin-right: 20px; border-radius: 8px; overflow: hidden; flex: 0 0 auto;"> 
      <img src="images/sleep.png" alt="wog" style="width: 320px; height: 180px; object-fit: contain; display: block; margin: 0 auto;"> 
    </div> 
    <div>
      <strong>SleepFormer: Towards Fully Autonomous Deadline Extension via Large Language Models</strong><br>
      <i style="font-size: 13px;">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </i><br> 
      We present SleepFormer, the first framework capable of automatically generating convincing excuses for missed deadlines, skipped meetings, and unfinished experiments.
      <br> 
      <b><i style="color:#83a1c7;">ACL 3026 Oral &nbsp;
      </i></b> 
      <a href=""><em>[arXiv]</em></a> 
      <a href=""><em>[code]</em></a> 
    </div>
  </div> 
</div>


<div class="publication-card" data-category="all"> 
  <div style="display: flex; align-items: center;">
    <div class="pub-media-rotator" data-interval="4000" style="position: relative; width: 320px; height: 180px; margin-right: 20px; border-radius: 8px; overflow: hidden; flex: 0 0 auto;"> 
      <img src="images/gpu.png" alt="wog" style="width: 320px; height: 180px; object-fit: contain; display: block; margin: 0 auto;"> 
    </div> 
    <div>
      <strong>Are GPUs Emotionally Stable? A Large-Scale Empirical Study Under 24/7 Training Stress</strong><br>
      <i style="font-size: 13px;">
        NVIDIA RTX 9090*,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su*</strong>
        </a>,
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang&dagger;</strong>
        </a>.
      </i><br> 
      We conduct the first psychological evaluation of modern GPUs under extreme training conditions. Results reveal that 87% of devices exhibit symptoms of burnout after repeated “just one more epoch” requests.
      <br> 
      <b><i style="color:#83a1c7;">ICLR 3026 &nbsp;
      </i></b> 
      <a href=""><em>[arXiv]</em></a> 
      <a href=""><em>[code]</em></a> 
    </div>
  </div> 
</div>

<div class="publication-card" data-category="all"> 
  <div style="display: flex; align-items: center;">
    <div class="pub-media-rotator" data-interval="4000" style="position: relative; width: 320px; height: 180px; margin-right: 20px; border-radius: 8px; overflow: hidden; flex: 0 0 auto;"> 
      <img src="images/noodle.png" alt="wog" style="width: 320px; height: 180px; object-fit: contain; display: block; margin: 0 auto;"> 
    </div> 
    <div>
      <strong>Instant Noodles as a Scalable Training Infrastructure for Graduate Students</strong><br>
      <i style="font-size: 13px;">
        Noodles&Dagger;,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su*</strong>
        </a>,
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang&dagger;</strong>
        </a>.
      </i><br> 
      We introduce Noodle-Scaling Law, showing that research productivity increases logarithmically with instant noodle consumption before collapsing catastrophically at 3 a.m.
      <br> 
      <b><i style="color:#83a1c7;">ICML 3026 &nbsp;
      </i></b> 
      <a href=""><em>[arXiv]</em></a> 
      <a href=""><em>[code]</em></a> 
    </div>
  </div> 
</div>

</div>


<div id="full-publications" class="publication-view" data-publication-view="list" hidden>
  <ul class="full-publication-list">
    <li>
      <span class="pub-list-badge">ACL 3030</span>
      <span class="pub-list-title">SleepFormer v5: Towards Fully Autonomous Deadline Extension via Large Language Models</span><br>
      <span class="pub-list-authors">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-note">Oral.</span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ACL 3029</span>
      <span class="pub-list-title">SleepFormer v4: Towards Fully Autonomous Deadline Extension via Large Language Models</span><br>
      <span class="pub-list-authors">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-note">Oral.</span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ACL 3028</span>
      <span class="pub-list-title">SleepFormer v3: Towards Fully Autonomous Deadline Extension via Large Language Models</span><br>
      <span class="pub-list-authors">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-note">Oral.</span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ACL 3027</span>
      <span class="pub-list-title">SleepFormer v2: Towards Fully Autonomous Deadline Extension via Large Language Models</span><br>
      <span class="pub-list-authors">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-note">Oral.</span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ACL 3026</span>
      <span class="pub-list-title">SleepFormer: Towards Fully Autonomous Deadline Extension via Large Language Models</span><br>
      <span class="pub-list-authors">
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang</strong>
        </a>,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-note">Oral.</span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ICLR 3026</span>
      <span class="pub-list-title">Are GPUs Emotionally Stable? A Large-Scale Empirical Study Under 24/7 Training Stress</span><br>
      <span class="pub-list-authors">
        NVIDIA RTX 9090*,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su*</strong>
        </a>,
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
    <li>
      <span class="pub-list-badge">ICLR 3026</span>
      <span class="pub-list-title">Instant Noodles as a Scalable Training Infrastructure for Graduate Students</span><br>
      <span class="pub-list-authors">
        Noodles&Dagger;,
        <a href="https://selen-suyue.github.io/" target="_blank">
          <strong>Yue Su*</strong>
        </a>,
        <a href="https://wd7ang.github.io" target="_blank">
          <strong>Weidong Tang&dagger;</strong>
        </a>.
      </span>
      <span class="pub-list-links"><a href="">[arXiv]</a><a href="">[code]</a></span>
    </li>
  </ul>
</div>

<script src="assets/js/show_publications.js"></script>
<script src="assets/js/pub_media_rotator.js"></script>


Projects
--------
<div class="project-card" data-category="project"> 
  <div style="display: flex; align-items: center;">
    <div class="pub-media-rotator" data-interval="4000" style="position: relative; width: 320px; height: 180px; margin-right: 20px; border-radius: 8px; overflow: hidden; flex: 0 0 auto;">
      <img src="images/2.png" alt="ManiUniCon" style="width: 320px; height: 180px; object-fit: contain; display: block; margin: 0 auto;">
    </div>
    <div> 
      <strong>WowPage</strong><br>
      <i style="font-size: 13px;">
        <a href="https://wd7ang.github.io" target="_blank"><strong>Weidong Tang</strong></a>,
        <a href="https://selen-suyue.github.io/" target="_blank"><strong>Yue Su</strong></a>.
      </i><br>
      In collaboration with Yue Su, I refined and improved his original homepage template. A clean standalone template version is coming soon.
      <br> 
      <b><i style="color:#83a1c7;">Project &nbsp;</i></b> 
      <a href=""><em>[code]</em></a> 
    </div>
  </div> 
</div>


Awards
--------
- *3026.01*, Successfully survived 17 consecutive paper deadlines without touching grass.
- *3025.09*, Best Excuse Generation Award, SleepFormer Research Group.
- *3025.06*, Outstanding Contributor to Instant Noodle Consumption Efficiency.
- *3024.12*, GPU Emotional Damage Scholarship (Full Funding).
- *3024.08*, Ranked Top 0.1% Worldwide in “I’ll Fix It Tomorrow”.



Services
--------
- *3026.06 – Present*, Chief Coffee Consumption Officer, Midnight Research Lab.
- *3026.01 – Present*, Full-time Debugger of Problems Created by Myself.
- Reviewer for Journal of Unfinished Projects.
- Area Chair for Conference on Last-Minute Submissions (CLMS).
- Volunteer Therapist for Burned-out GPUs.



Talks
--------
- *3026.07*, “How to Finish a Paper 3 Minutes Before Deadline.”
- *3026.05*, “Large Language Models and Large Amounts of Caffeine.”
- *3025.11*, “On the Emotional Stability of GPUs Under Extreme Stress.”
- *3025.08*, “Instant Noodles as Scalable Research Infrastructure.”
- *3025.03*, “Sleep is Temporary, Camera-Ready is Forever.”
