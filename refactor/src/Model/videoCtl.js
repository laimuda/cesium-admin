/**
 * @file 视频监控
 */
define( [
    'Cesium',
    'EntityCtl',
    'api',
    'Bubble',
    'viewer'
], function ( Cesium, EntityCtl, api, Bubble, _viewer ) {
    'use strict';

    var entity, count = 0;

    var TYPE = 'video/mp4';

    var DEVICE_ID = '${device_id}';

    var videoCtl = new EntityCtl( {
        detail: '视频监控散点'
    } );

    $.extend( videoCtl, {

        post: api.getVideoMsg,

        push: function ( opts ) {
            var index = 0;

            entity = new Cesium.Entity( {
                name: '视频监控',
                position : opts.position,
                vsrc: opts.src ? opts.src : '',
                vtype: opts.type || TYPE,
                visMore: opts.isMore,
                vCount: opts.count,
                vids: opts.ids,
                vcurIds: opts.curIds,
                vurls: opts.urls,
                vclong: opts.clong,
                vclaitu: opts.claitu,
                count: count++,
                vdata: opts.data,
                billboard: {
                    image: opts.image || '/resource/images/icon/monitor-Point.png',
                    show: false,
                    width: 20,
                    height: 20
                }
            } );

            if ( entity._vCount > 1 ) { // 有些点是重复的
                index = this.findIndex( function ( item ) {
                    return item._vclong === entity._vclong && item._vclaitu === entity._vclaitu;
                } );
                this._entities[ index ]._znvEntities.push( entity );
                entity._znvEntities = this._entities[ index ]._znvEntities;
                this._entities[ index ] = entity;
            } else {
                var znvEntities = entity._znvEntities = new EntityCtl( {
                    detail: 'entities->entities'
                } );
                znvEntities.push( entity );
                this._entities.push( entity );
            }

            return entity;
        },

        // 显示或者隐藏
        turn: function ( flag ) {
            $.each( this._entities, function ( index, entity ) {
                // entity.show = flag;
                entity._billboard.show = flag;
            } );
            this._show = flag;
            return this;
        },

        // play: api.playVideo,
        play: function ( url, _entity ) {
            $( '#znvPlayer' ).remove();
                var $video = $(
                    '<video id="znvPlayer" class="znv-player" controls autoplay>' +
                        '<source src="' + url + '" type="application/x-mpegURL"></source>' +
                    '</video>'
                );
                // $( '.cesium-infoBox' ).append( $video );
                $( '#sandzMap' ).append( $video );

                if ( _entity !== undefined ) {
                    var bubble = new Bubble( _viewer.scene, 'bubble2', 30, -10 );
                    var bubbleposition = new Cesium.Cartesian3.fromDegrees(
                        _entity._vclong,
                        _entity._vclaitu,
                        0
                    );
                    $( '#bubble2' ).html( $video );
                    bubble.showAt( bubbleposition );
                    _viewer.bubble2 = bubble;
                }

                // 视频监控
                var player = new EZUIPlayer( 'znvPlayer' );

                // player.on( 'play', function() {
                //     // videoCtl.play();
                //     console.log( 'player:play' );
                // } );
                // player.on( 'pause', function() {
                //     console.log( 'player:pause' );
                // } );
                // player.on( 'error', function() {
                //     console.log( 'player:error' );
                // } );
        },

        pause: function () {
            return this;
        },

        close: function () {
            return this;
        }
    } );

    return videoCtl;
} );
