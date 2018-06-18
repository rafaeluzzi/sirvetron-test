var beertronApp = angular.module('beertronApp', []);

beertronApp.controller('resultsCtrl', function ($scope,$rootScope,$timeout) {


  $scope.alert = 'wepa we live!';
  $scope.user = '';
  $scope.username = "";

$scope.login = function(){
  var eluser = document.getElementById('user').value;
  $scope.username = eluser;
  $scope.db.collection("users").where("username", "==", $scope.username)
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            $scope.user = doc.data();
            $scope.user.userid = doc.id;
            console.log(doc.id);
             $scope.$apply();

        });

    });


}//ends login
$scope.send = function(mode,tapid){
    if($scope.user){
        /*pubnub.publish(
          {
              message: {
                  'light': mode,'user':$scope.user.username
              },
              channel: 'sirvetron',
              sendByPost: false, // true to send via post
              storeInHistory: false, //override default storage options
              meta: {
                  "cool": "meta"
              }   // publish extra meta with the request
          },
          function (status, response) {
              if (status.error) {
                  // handle error
                  console.log(status)
              } else {

              }
          }
        );*/
        pubnub.publish({
    channel  : 'sirvetron',
    message  : {
        'light': mode,'user':$scope.user.username,'userid':$scope.user.userid,'tapid':tapid
    },
    callback : function(m){
        console.log(m);
        console.log("Beertron "+mode+" w/ timetoken");
    }
});
      }else{
        alert('NO AUTH USER');
      }
}// ends send

});
beertronApp.controller('displayCtrl', function ($scope,$rootScope,$timeout) {
  $scope.db = firebase.firestore();
  const settings = {timestampsInSnapshots: true};
  $scope.db.settings(settings);
  $scope.db.collection("taps").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            console.log(JSON.stringify(doc.data()));
            $scope['el'+doc.id] = doc.data();
            $scope['el'+doc.id].price = 0.354882 / 29 * $scope['el'+doc.id].keg_resale_price;
            $scope['el'+doc.id].price_2 = $scope['el'+doc.id].price.toFixed(2);
            //console.log(JSON.stringify(doc.data()));
             $scope.$apply();
            // $scope.$apply();
        });

    });
  $scope.log_user = function(userid,tapid){
    var docRef = $scope.db.collection("users").doc(userid);
    docRef.onSnapshot(function(doc) {
        if (doc.exists) {
              $scope['user'+tapid] = doc.data();
            //console.log(JSON.stringify(doc.data()));
             $scope.$apply();
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
    });
  };

  $scope.end_user = function(userid,tapid){
      $scope['user'+tapid] = null;
  }

  });
