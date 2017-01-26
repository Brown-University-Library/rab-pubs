harvest.pending = (function() {

    var
      configMap = {
        pending_model : null
      },

      stateMap = {},

      jqueryMap = {},

      loadPending, makePendingList,

      onClickPendingDetailsModal,
      setJqueryMap, initModule;


    setJqueryMap = function() {
      var 
        $sources = $('.api-source');
        jqueryMap = {
          'sources' : {},
          $modal : $('#modalDetails'),
          $table : $('#detailsTable'),
        };

      $.each($sources, function( i, source ) {
        var rabid = $( this ).data('rabid');
        var $panel = $( this ).find('.panel-collapse');

        jqueryMap.sources[rabid] = $panel;
      });
    };

    makePendingList = function( jsonList ) {
      var list_items = [];

      jsonList.forEach( function( pendingObj ) {
        var pendingObj,
            $li, $title, $venue, $date, $modal_btn;

        $li = $('<li/>', {  'class'       : 'list-group-item',
                            'data-source' : pendingObj.source,
                            'data-exid'   : pendingObj.exid,
                          });
        $title = $('<span/>', { 'class' : 'pending-title',
                                'text'  : pendingObj.display.short.title });
        $venue = $('<span/>', { 'class' : 'pending-venue',
                                'text'  : pendingObj.display.short.venue });
        $date = $('<span/>', {  'class' : 'pending-date',
                                'text'  : pendingObj.display.short.date });
        $modal_btn = $('<button/>', { 'type'        : 'button',
                                      'class'       : 'btn btn-primary details-modal',
                                      'data-exid'   : pendingObj.exid
                                    });

        $modal_btn.on('click', function(e) {
          e.preventDefault();

          var exid = $( this ).data('exid');
          onClickPendingDetailsModal( exid );
        });

        $li.append($title);
        $li.append($venue);
        $li.append($date);
        $li.append($modal_btn);

        list_items.push( $li );
      });

      return list_items;
    };

    loadPending = function (source) {
      var sourceData,
        $lis, $list, $target;

        sourceData = configMap.pending_model.all( {'source' : source} );
        $lis = makePendingList( sourceData );
        $list = $('<ol/>', {'class' : 'list-group'});
        $lis.forEach( function($li) {
          $list.append($li);
        });

        $target = jqueryMap.sources[ source ];
        $target.append($list);     
    };

    onClickPendingDetailsModal = function ( exid ) {
      var
        $modal, $table,
        pendingObj;
      
      $modal = jqueryMap.$modal;
      $table = jqueryMap.$table;
      $table.empty();

      pendingObj = configMap.pending_model.get( {'exid' : exid.toString() });
      pendingObj.display.details.forEach( function( detailsObj ) {
          $tr = $('<tr/>');
          $key = $('<td/>', {'text' : detailsObj.key });
          $value = $('<td/>', {'text' : detailsObj.value });

          $tr.append($key);
          $tr.append($value);
          $table.append($tr);
      });
      $modal.modal('show');
    };

    configModule = function ( map ) {
      configMap.pending_model = map.pending_model;
    };

    initModule = function () {
      setJqueryMap();
    };

    return {
      loadPending: loadPending,
      configModule: configModule,
      initModule: initModule
    };
}());