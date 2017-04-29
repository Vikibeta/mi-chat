module.exports =  {
  'BODY_FIXED': {
    beforeRouteEnter(to, from, next){
      document.body.className = 'body-fixed';
      next()
    },
    beforeRouteLeave(to, from, next){
      document.body.className = '';
      next();
    }
  }
};
