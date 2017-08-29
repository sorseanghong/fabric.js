(function() {

  QUnit.module('fabric.Circle');

  test('constructor', function(){
    ok(fabric.Circle);

    var circle = new fabric.Circle();

    ok(circle instanceof fabric.Circle, 'should inherit from fabric.Circle');
    ok(circle instanceof fabric.Object, 'should inherit from fabric.Object');

    deepEqual(circle.type, 'circle');
  });

  test('getRadiusX, getRadiusY', function() {
    var circle = new fabric.Circle({ radius: 10 });

    ok(typeof circle.getRadiusX == 'function', 'getRadiusX should exist');
    ok(typeof circle.getRadiusY == 'function', 'getRadiusY should exist');

    equal(circle.getRadiusX(), 10);
    equal(circle.getRadiusY(), 10);

    circle.scale(2);

    equal(circle.getRadiusX(), 20);
    equal(circle.getRadiusY(), 20);

    circle.set('scaleX', 3);

    equal(circle.getRadiusX(), 30);
    equal(circle.getRadiusY(), 20);

    circle.set('scaleY', 4);

    equal(circle.getRadiusX(), 30);
    equal(circle.getRadiusY(), 40);
  });

  test('setRadius', function() {
    var circle = new fabric.Circle({radius: 10, strokeWidth: 0});

    ok(typeof circle.setRadius == 'function');

    equal(circle.getRadiusX(), 10);
    equal(circle.getRadiusY(), 10);

    equal(circle.width, 20);
    equal(circle.height, 20);

    equal(circle, circle.setRadius(20));

    equal(circle.getRadiusX(), 20);
    equal(circle.getRadiusY(), 20);

    equal(circle.width, 40);
    equal(circle.height, 40);
  });

  test('set radius', function() {
    var circle = new fabric.Circle({strokeWidth: 0});

    circle.set('radius', 20);

    equal(circle.getRadiusX(), 20);
    equal(circle.getRadiusY(), 20);

    equal(circle.width, 40);
    equal(circle.height, 40);
  });

  test('complexity', function() {
    var circle = new fabric.Circle();
    ok(typeof circle.complexity == 'function');
    equal(circle.complexity(), 1);
  });

  test('toObject', function() {
    var circle = new fabric.Circle();
    var defaultProperties = {
      'version':                  fabric.version,
      'type':                     'circle',
      'originX':                  'left',
      'originY':                  'top',
      'left':                     0,
      'top':                      0,
      'width':                    0,
      'height':                   0,
      'fill':                     'rgb(0,0,0)',
      'stroke':                   null,
      'strokeWidth':              1,
      'strokeDashArray':          null,
      'strokeLineCap':            'butt',
      'strokeLineJoin':           'miter',
      'strokeMiterLimit':         10,
      'scaleX':                   1,
      'scaleY':                   1,
      'angle':                    0,
      'flipX':                    false,
      'flipY':                    false,
      'opacity':                  1,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'clipTo':                   null,
      'fillRule':                 'nonzero',
      'globalCompositeOperation': 'source-over',
      'radius':                   0,
      'startAngle':               0,
      'endAngle':                 2 * Math.PI,
      'skewX':                    0,
      'skewY':                    0,
      'transformMatrix':          null
    };
    ok(typeof circle.toObject == 'function');
    deepEqual(circle.toObject(), defaultProperties);

    circle.set('left', 100).set('top', 200).set('radius', 15);

    var augmentedProperties = fabric.util.object.extend(fabric.util.object.clone(defaultProperties), {
      left:   100,
      top:    200,
      width:  30,
      height: 30,
      radius: 15
    });

    deepEqual(circle.toObject(), augmentedProperties);
  });

  test('fromElement', function() {
    ok(typeof fabric.Circle.fromElement == 'function');

    var elCircle         = fabric.document.createElement('circle'),
        radius           = 10,
        left             = 12,
        top              = 15,
        fill             = 'ff5555',
        opacity          = 0.5,
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevil',
        strokeMiterLimit = 5;


    elCircle.setAttribute('r', radius);
    elCircle.setAttribute('cx', left);
    elCircle.setAttribute('cy', top);
    elCircle.setAttribute('fill', fill);
    elCircle.setAttribute('opacity', opacity);
    elCircle.setAttribute('stroke-width', strokeWidth);
    elCircle.setAttribute('stroke-dasharray', '5, 2');
    elCircle.setAttribute('stroke-linecap', strokeLineCap);
    elCircle.setAttribute('stroke-linejoin', strokeLineJoin);
    elCircle.setAttribute('stroke-miterlimit', strokeMiterLimit);

    fabric.Circle.fromElement(elCircle, function(oCircle) {
      ok(oCircle instanceof fabric.Circle);
      equal(oCircle.get('radius'), radius);
      equal(oCircle.get('left'), left - radius);
      equal(oCircle.get('top'), top - radius);
      equal(oCircle.get('fill'), fill);
      equal(oCircle.get('opacity'), opacity);
      equal(oCircle.get('strokeWidth'), strokeWidth);
      deepEqual(oCircle.get('strokeDashArray'), strokeDashArray);
      equal(oCircle.get('strokeLineCap'), strokeLineCap);
      equal(oCircle.get('strokeLineJoin'), strokeLineJoin);
      equal(oCircle.get('strokeMiterLimit'), strokeMiterLimit);

      var elFaultyCircle = fabric.document.createElement('circle');
      elFaultyCircle.setAttribute('r', '-10');

      var error;
      try {
        fabric.Circle.fromElement(elFaultyCircle);
      }
      catch (err) {
        error = err;
      }
      ok(error, 'negative attribute should throw');

      elFaultyCircle.removeAttribute('r');

      error = void 0;
      try {
        fabric.Circle.fromElement(elFaultyCircle);
      }
      catch (err) {
        error = err;
      }

      ok(error, 'inexstent attribute should throw');
    });
  });

  asyncTest('fromObject', function() {
    ok(typeof fabric.Circle.fromObject == 'function');

    var left    = 112,
        top     = 234,
        radius  = 13.45,
        fill    = 'ff5555';

    fabric.Circle.fromObject({
      left: left, top: top, radius: radius, fill: fill
    }, function(circle) {
      ok(circle instanceof fabric.Circle);

      equal(circle.get('left'), left);
      equal(circle.get('top'), top);
      equal(circle.get('radius'), radius);
      equal(circle.get('fill'), fill);

      var expected = circle.toObject();
      fabric.Circle.fromObject(expected, function(actual) {
        deepEqual(actual.toObject(), expected);
        start();
      });
    });
  });

  test('cloning and radius, width, height', function() {
    var circle = new fabric.Circle({ radius: 10, strokeWidth: 0});
    circle.scale(2);

    circle.clone(function(clone) {
      equal(clone.width, 20);
      equal(clone.getScaledWidth(), 40);
      equal(clone.height, 20);
      equal(clone.getScaledHeight(), 40);
      equal(clone.radius, 10);
    });
  });
})();
