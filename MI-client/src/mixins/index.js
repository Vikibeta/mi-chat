module.exports =  {
  'BODY_CLASS': {
    beforeRouteEnter(to, from, next){
      document.body.className = 'body-auto';
      next()
    },
    beforeRouteLeave(to, from, next){
      document.body.className = '';
      next();
    }
  }
};
