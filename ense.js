[1mdiff --git a/manifest.json b/manifest.json[m
[1mindex a0ee6f0..50513c8 100644[m
[1m--- a/manifest.json[m
[1m+++ b/manifest.json[m
[36m@@ -136,11 +136,6 @@[m
     }[m
   ],[m
   "related_applications": [[m
[31m-    {[m
[31m-      "platform": "play",[m
[31m-      "url": "https://play.google.com/store/apps/details?id=com.java.dspractice",[m
[31m-      "id": "com.java.dspractice"[m
[31m-    },[m
     {[m
       "platform": "web",[m
       "url": "https://carter-112.github.io/CS-Practice/",[m
[1mdiff --git a/solution-fix.js b/solution-fix.js[m
[1mindex e5ec81c..230d177 100644[m
[1m--- a/solution-fix.js[m
[1m+++ b/solution-fix.js[m
[36m@@ -105,16 +105,17 @@[m [mdocument.addEventListener('DOMContentLoaded', function() {[m
     pre::before {[m
       display: block !important;[m
       position: absolute !important;[m
[31m-      top: 0 !important;[m
[31m-      left: 0 !important;[m
[32m+[m[32m      top: 10px !important;[m
[32m+[m[32m      left: 15px !important;[m
       z-index: 1000 !important;[m
       background-color: #FF5722 !important;[m
       color: white !important;[m
[31m-      padding: 10px 20px !important;[m
[32m+[m[32m      padding: 8px 15px !important;[m
       font-weight: bold !important;[m
[31m-      font-size: 16px !important;[m
[31m-      width: auto !important;[m
[31m-      border-radius: 0 0 5px 0 !important;[m
[32m+[m[32m      font-size: 14px !important;[m
[32m+[m[32m      width: auto !important;[m[41m [m
[32m+[m[32m      border-radius: 4px !important;[m
[32m+[m[32m      box-shadow: 0 2px 5px rgba(0,0,0,0.5) !important;[m
     }[m
   `;[m
   document.head.appendChild(style);[m
