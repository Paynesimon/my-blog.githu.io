// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
   // 为所有卡片添加点击跳转功能（如果需要）
   const projectCards = document.querySelectorAll('.card');
   projectCards.forEach(card => {
     // 点击卡片除按钮外的区域，跳转到对应详情页
     card.addEventListener('click', function(e) {
       if (!e.target.closest('.btn')) {
         const link = this.querySelector('.btn');
         if (link) {
           window.location.href = link.getAttribute('href');
         }
       }
     });
   });

   // 简单的滚动动画效果
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
       e.preventDefault();
       const targetId = this.getAttribute('href');
       if (targetId !== '#') {
         const targetElement = document.querySelector(targetId);
         if (targetElement) {
           window.scrollTo({
             top: targetElement.offsetTop - 80, // 减去导航栏高度
             behavior: 'smooth'
           });
         }
       }
     });
   });
 });