GiveItAll.DancerScriptLoader = function($mainFrame, color, rhythm, timer, startOffset) {

    let scriptStart = performance.now();

    let dancerColor, limbs = [];

    let head, neck, middle, lower, leftShoulder, rightShoulder, leftElbow, rightElbow,
        leftHand, rightHand, leftHip, rightHip, leftKnee, rightKnee, leftFoot, rightFoot;

    dancerColor = color;

    $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle"))
        .children()
        .attr({
            id: "head",
            cx: "50",
            cy: "40",
            r: "4",
            fill: dancerColor,
            stroke: dancerColor,
            "stroke-width": "0.5"
        });

    for (let i = 0; i < 15; i++) {
        $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
    }

    let $joints = $mainFrame.children(":gt(0)")
        .attr({
            r: "2",
            fill: dancerColor,
            stroke: dancerColor,
            "stroke-width": "0.2"
        }).addClass("joint");

    {
        $joints.eq(0).attr({
            id: "neck",
            cx: "50",
            cy: "44"
        })

            .next().attr({
            id: "middle",
            cx: "50",
            cy: "55"
        })

            .next().attr({
            id: "lower",
            cx: "50",
            cy: "63"
        })

            .next().attr({
            id: "left-shoulder",
            cx: "52",
            cy: "46.5"
        })

            .next().attr({
            id: "right-shoulder",
            cx: "48",
            cy: "46.5"
        })

            .next().attr({
            id: "left-elbow",
            cx: "55",
            cy: "56"
        })

            .next().attr({
            id: "right-elbow",
            cx: "45",
            cy: "56"
        })

            .next().attr({
            id: "left-hand",
            cx: "55.5",
            cy: "67"
        })

            .next().attr({
            id: "right-hand",
            cx: "44.5",
            cy: "67"
        })

            .next().attr({
            id: "left-hip",
            cx: "50.5",
            cy: "64"
        })

            .next().attr({
            id: "right-hip",
            cx: "49.5",
            cy: "64"
        })

            .next().attr({
            id: "left-knee",
            cx: "52.5",
            cy: "77"
        })

            .next().attr({
            id: "right-knee",
            cx: "47.5",
            cy: "77"
        })

            .next().attr({
            id: "left-foot",
            cx: "53.5",
            cy: "88"
        })

            .next().attr({
            id: "right-foot",
            cx: "46.5",
            cy: "88"
        });
    }

    function drawLimb(e) {
        $mainFrame.append(document.createElementNS("http://www.w3.org/2000/svg", "line"))
            .children(":last")
            .attr({
                x1: e.first().css("cx"),
                y1: e.first().css("cy"),
                x2: e.last().css("cx"),
                y2: e.last().css("cy"),
                stroke: dancerColor,
                "stroke-width": "4"
            })
    }

    head = $(document.getElementById("head"));
    neck = $(document.getElementById("neck"));
    middle = $(document.getElementById("middle"));
    lower = $(document.getElementById("lower"));
    leftShoulder = $(document.getElementById("left-shoulder"));
    rightShoulder = $(document.getElementById("right-shoulder"));
    leftElbow = $(document.getElementById("left-elbow"));
    rightElbow = $(document.getElementById("right-elbow"));
    leftHand = $(document.getElementById("left-hand"));
    rightHand = $(document.getElementById("right-hand"));
    leftHip = $(document.getElementById("left-hip"));
    rightHip = $(document.getElementById("right-hip"));
    leftKnee = $(document.getElementById("left-knee"));
    rightKnee = $(document.getElementById("right-knee"));
    leftFoot = $(document.getElementById("left-foot"));
    rightFoot = $(document.getElementById("right-foot"));

    limbs.push($mainFrame.children("#neck, #middle"));
    limbs.push($mainFrame.children("#middle, #lower"));
    limbs.push($mainFrame.children("#left-shoulder, #left-elbow"));
    limbs.push($mainFrame.children("#right-shoulder, #right-elbow"));
    limbs.push($mainFrame.children("#left-elbow, #left-hand"));
    limbs.push($mainFrame.children("#right-elbow, #right-hand"));
    limbs.push($mainFrame.children("#left-hip, #left-knee"));
    limbs.push($mainFrame.children("#right-hip, #right-knee"));
    limbs.push($mainFrame.children("#left-knee, #left-foot"));
    limbs.push($mainFrame.children("#right-knee, #right-foot"));

    limbs[0].l = 11;
    limbs[1].l = 8;
    limbs[2].l = 10;
    limbs[3].l = 11;
    limbs[4].l = 10;
    limbs[5].l = 11;
    limbs[6].l = 14;
    limbs[7].l = 12;
    limbs[8].l = 14;
    limbs[9].l = 12;

    for (let i = 0; i < 10; i++) {
        limbs[i].i = i;
    }

    limbs.forEach(drawLimb);

    function redrawLimb(e) {
        $mainFrame.children(`:eq(${16 + e.i})`)
            .replaceWith(document.createElementNS("http://www.w3.org/2000/svg", "line"));
        $mainFrame.children(`:eq(${16 + e.i})`)
            .attr({
                x1: e.first().css("cx"),
                y1: e.first().css("cy"),
                x2: e.last().css("cx"),
                y2: e.last().css("cy"),
                stroke: dancerColor,
                "stroke-width": "4"
            })
    }

    function pow(exp) {
        return function (x) {
            return Math.pow(x, exp);
        }
    }

    function rev(exp) {
        return function (x) {
            return 1 - Math.pow(1 - x, exp);
        }
    }

    let resetTrigger = 0;

    function moveJoint(joint, finalX, finalY, limbIndex, duration, timing, arc = true, reverse = false, resetCond = false) {

        let resetCheck = resetTrigger;
        if (resetCond)
            resetCheck = 0;
        if (resetCheck)
            return;
        let startX = parseFloat(joint.attr("cx"));
        let startY = parseFloat(joint.attr("cy"));

        let gainX, gainY;

        finalX = finalX.toString();
        finalY = finalY.toString();

        if (finalX.match(/^-?[\d]*.?[\d]+o$/i))
            gainX = parseFloat(finalX);
        else
            gainX = parseFloat(finalX) - startX;

        if (finalY.match(/^-?[\d]*.?[\d]+o$/i))
            gainY = parseFloat(finalY);
        else
            gainY = parseFloat(finalY) - startY;

        let axis;
        if (gainX < 0) {
            if (gainY < 0) {
                axis = 1;
            }
            else {
                axis = 2;
            }
        }
        else {
            if (gainY > 0) {
                axis = 3;
            }
            else {
                axis = 4;
            }
        }

        if (reverse) {
            axis = axis % 4 + 1;
        }
        let start = performance.now();
        let movement = requestAnimationFrame(function animate(time) {
            let fragment = (time - start) / duration;
            fragment = fragment > 1 ? 1 : fragment;

            let resolved = timing(fragment);
            if (arc === true) {
                if (axis === 1) {
                    joint.attr({
                        cx: startX + gainX * resolved,
                        cy: startY + gainY * fragment
                    })
                }
                else if (axis === 2) {
                    joint.attr({
                        cx: startX + gainX * fragment,
                        cy: startY + gainY * resolved
                    })
                }
                else if (axis === 3) {
                    joint.attr({
                        cx: startX + gainX * resolved,
                        cy: startY + gainY * fragment
                    })
                }
                else {
                    joint.attr({
                        cx: startX + gainX * fragment,
                        cy: startY + gainY * resolved
                    })
                }
            }
            else {
                joint.attr({
                    cx: startX + resolved * gainX,
                    cy: startY + resolved * gainY
                });
            }
            if (Array.isArray(limbIndex)) {
                for (let index of limbIndex) {
                    redrawLimb(limbs[index]);
                }
            }
            else redrawLimb(limbs[limbIndex]);
            if (resetCond)
                resetCheck = 0;
            else
                resetCheck = resetTrigger;
            if (resetCheck)
                cancelAnimationFrame(movement);
            if (fragment < 1)
                requestAnimationFrame(animate);
        })

    }

    let timePassed = 0;
    let intermediate;

    function armWave(rhythm = 150) {
        if (resetTrigger)
            return;

        let elapsed;

        moveJoint(rightShoulder, "0o", "1.5o", 3, rhythm, pow(3));
        moveJoint(rightElbow, "3o", "2o", 3, rhythm, pow(3));
        moveJoint(rightHand, "3.5o", "1o", 5, rhythm, pow(3));

        moveJoint(leftShoulder, "-.5o", "-1.5o", 2, rhythm, pow(3));
        moveJoint(leftElbow, "0o", "-1.5o", 2, rhythm, pow(1), true, true);
        moveJoint(leftHand, ".5o", "-1.5o", 4, rhythm, pow(1), true, true);

        moveJoint(leftKnee, "1.5o", "-1o", [6, 8], rhythm, pow(3));
        moveJoint(rightKnee, ".5o", "-.5o", [7, 9], rhythm, pow(3));

        if (resetTrigger)
            return;
        elapsed = rhythm;

        setTimeout(function () {
            moveJoint(leftElbow, "6.5o", "-8o", 2, rhythm, pow(3));
            moveJoint(leftHand, "5.5o", "-9o", 4, rhythm, pow(3));
            moveJoint(head, "0o", ".3o", [], rhythm, pow(1));
        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(leftShoulder, "0.5o", "1.5o", 2, rhythm, pow(3));
            moveJoint(leftElbow, "1.5o", "0o", 2, rhythm, pow(3), false);
            moveJoint(leftHand, "11.5o", "-10o", 4, rhythm, pow(3));
            moveJoint(head, "0o", ".2o", [], rhythm, pow(1));
        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(leftShoulder, "-.5o", "-1.5o", 2, rhythm, pow(3));
            moveJoint(leftElbow, "-1.5o", "0o", 2, rhythm, pow(3));
            moveJoint(leftHand, "-11.5o", "10o", 4, rhythm, pow(3), true, true);
            moveJoint(head, "0o", ".5o", [], rhythm, pow(1));
        }, elapsed * 1.2);
        elapsed = rhythm + 1.2 * elapsed;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(leftShoulder, "0.5o", "3o", 2, rhythm, pow(3));
            moveJoint(leftElbow, "-9.5o", "11.5o", 2, rhythm * 1.2, pow(3), true, true);
            moveJoint(leftHand, "-10.5o", "11.5o", 4, rhythm * 1.2, pow(3), true, true);

            moveJoint(rightShoulder, ".5o", "-3o", 3, rhythm, pow(3));
            moveJoint(rightElbow, "-3o", "-3.5o", 3, rhythm, pow(1));
            moveJoint(rightHand, "-4o", "-2.5o", 5, rhythm, pow(1));

            moveJoint(leftKnee, "-2o", ".5o", [6, 8], rhythm, pow(3));
            moveJoint(rightKnee, "-2o", "-.5o", [7, 9], rhythm, pow(3));

        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(rightElbow, "-5.5o", "-8o", 3, rhythm, pow(3), true, true);
            moveJoint(rightHand, "-4.5o", "-9o", 5, rhythm, pow(3), true, true);
        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(rightShoulder, "-0.5o", "1.5o", 3, rhythm, pow(3));
            moveJoint(rightElbow, "-2.5o", "0o", 3, rhythm, pow(3), false);
            moveJoint(rightHand, "-12.5o", "-10o", 5, rhythm, pow(3), true, true);
        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(rightShoulder, ".5o", "-1.5o", 3, rhythm, pow(3));
            moveJoint(rightElbow, "2.5o", "0o", 3, rhythm, pow(3));
            moveJoint(rightHand, "12.5o", "10o", 5, rhythm, pow(3));
        }, elapsed * 1.2);
        elapsed = rhythm + 1.2 * elapsed;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(rightShoulder, "-.5o", "1.5o", 3, rhythm, pow(2));
            moveJoint(rightElbow, "5.5o", "9.5o", 3, rhythm, pow(2));
            moveJoint(rightHand, "5o", "10.5o", 5, rhythm, pow(2));

            moveJoint(leftShoulder, "0o", "-1.5o", 2, rhythm, pow(2));
            moveJoint(leftElbow, "3.5o", "-2o", 2, rhythm, pow(2));
            moveJoint(leftHand, "4.5o", "-1o", 4, rhythm, pow(2));

            moveJoint(head, "0o", "-1o", [], 250, pow(1));

            moveJoint(rightKnee, "1.5o", "1o", [7, 9], 350, pow(2));
            moveJoint(leftKnee, ".5o", ".5o", [6, 8], 300, pow(2));

        }, elapsed);
        elapsed += 300;

        intermediate = elapsed;
    }

    function sidestep(rhythm = 150) {
        if (resetTrigger)
            return;

        moveJoint(head, "-6.8o", "2.5o", [], rhythm, pow(3));
        moveJoint(neck, "-6o", "2o", 0, rhythm, pow(3));
        moveJoint(middle, "-2o", "0o", 1, rhythm, pow(3));

        moveJoint(leftShoulder, "-5o", "2o", 2, rhythm, pow(3));
        moveJoint(leftElbow, "0o", "-3o", 4, rhythm, pow(3));
        moveJoint(leftHand, "0o", "-3o", 4, rhythm, pow(3));

        moveJoint(rightShoulder, "-5o", "2o", 3, rhythm, pow(3));
        moveJoint(rightElbow, "-8o", "0.5o", 5, rhythm, pow(3));
        moveJoint(rightHand, "-8o", "0.5o", 5, rhythm, pow(3));

        moveJoint(leftKnee, "0o", "-3.4o", 6, rhythm, pow(3));
        moveJoint(leftFoot, "0o", "-3.2o", 8, rhythm, pow(3));

        let elapsed = rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(head, "15o", "-1.9o", [], rhythm, pow(2), false);
            moveJoint(neck, "14.5o", "-1.4o", 0, rhythm, pow(2), false);
            moveJoint(middle, "9.5o", "0o", 0, rhythm, pow(2), false);
            moveJoint(lower, "8o", "0o", 1, rhythm, pow(3), false);

            moveJoint(leftShoulder, "13.5o", "0o", 2, rhythm, pow(2), false);
            moveJoint(leftElbow, "11o", "3o", 2, rhythm, pow(2), false);
            moveJoint(leftHand, "11o", "3o", 4, rhythm, pow(2), false);

            moveJoint(rightShoulder, "13.5o", "-1o", 3, rhythm, pow(2), false);
            moveJoint(rightElbow, "18o", "-8o", 3, rhythm, pow(2), false);
            moveJoint(rightHand, "19o", "-19o", 5, rhythm, pow(2), false);

            moveJoint(leftHip, "8o", "0o", 6, rhythm, pow(3), false);
            moveJoint(leftKnee, "12o", "4o", 6, rhythm, pow(3), false);
            moveJoint(leftFoot, "12o", "3.2o", 8, rhythm, pow(3), false);

            moveJoint(rightHip, "8o", "0o", 7, rhythm, pow(3), false);
            moveJoint(rightKnee, "4.1o", "0o", 9, rhythm, pow(3), false);

        }, elapsed);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(leftElbow, "3o", "-2o", 2, rhythm, rev(3), true, true);
            moveJoint(leftHand, "4o", "-2o", 4, rhythm, rev(3), true, true);

            moveJoint(rightHip, "1o", "-1o", 7, rhythm, rev(3), false);
            moveJoint(rightKnee, "0o", "-5o", 7, rhythm, rev(3));
            moveJoint(rightFoot, "0o", "-5o", 9, rhythm, rev(3));
        }, elapsed);
        elapsed += rhythm / 2;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(head, "-7o", "5o", [], rhythm / 2, pow(3));
            moveJoint(lower, "-5.5o", "5o", 1, rhythm / 2, pow(3));
            moveJoint(middle, "-5o", "5o", [0, 1], rhythm / 2, pow(3));
            moveJoint(neck, "-7o", "5o", 0, rhythm / 2, pow(3));

            moveJoint(leftShoulder, "-6o", "3.5o", 2, rhythm / 2, pow(3));
            moveJoint(leftElbow, "-5.6o", "2o", 4, rhythm / 2, pow(3));
            moveJoint(leftHand, "-14o", ".5o", 4, rhythm / 2, pow(3));

            moveJoint(rightShoulder, "-6o", "5.5o", 3, rhythm / 2, pow(3));
            moveJoint(rightElbow, "-12o", "8.8o", 3, rhythm / 2, pow(3), false);
            moveJoint(rightHand, "-7o", "18.5o", 5, rhythm / 2, pow(3), false);

            moveJoint(leftHip, "-5.5o", "5o", 6, rhythm / 2, pow(3));
            moveJoint(leftKnee, "-3o", "3o", [6, 8], rhythm / 2, pow(3));

            moveJoint(rightHip, "-6.2o", "6o", 7, rhythm / 2, pow(1), false);
            moveJoint(rightKnee, "-9.5o", "8o", 9, rhythm / 2, pow(1), false);
            moveJoint(rightFoot, "-7.5o", "6o", 9, rhythm / 2, pow(1), false);

        }, elapsed + rhythm);
        elapsed += 2 * rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(leftHip, "-0.5o", "-2o", 6, rhythm / 2, pow(3), false);
            moveJoint(leftKnee, "0o", "-2o", 6, rhythm / 2, pow(3));
            moveJoint(leftFoot, "0o", "-2o", 8, rhythm / 2, pow(3));

            moveJoint(rightKnee, "1o", "0.25o", [7, 9], rhythm, pow(3));

            moveJoint(lower, "0.25o", "-2o", 1, rhythm / 2, pow(3));
            moveJoint(middle, "0.25o", "-2o", [0, 1], rhythm / 2, pow(3));
            moveJoint(neck, "1o", "-2o", 0, rhythm / 2, pow(3));
            moveJoint(head, "1o", "-2o", 0, rhythm / 2, pow(3));

            moveJoint(leftShoulder, "0.25o", "-1o", 2, rhythm / 2, pow(1), false);
            moveJoint(leftElbow, "1o", "1o", [2, 4], rhythm / 2, pow(1), false);
            moveJoint(leftHand, "0o", "-2o", 4, rhythm / 2, pow(1), false);

            moveJoint(rightShoulder, "0o", "-2o", 3, rhythm / 2, pow(1), false);
            moveJoint(rightElbow, "-1o", "0o", [3, 5], rhythm / 2, pow(1), false);
            moveJoint(rightHand, "0.5o", "-3.25o", 5, rhythm / 2, pow(1), false);

        }, elapsed);
        setTimeout(function () {
            moveJoint(leftHip, "1.25o", "2o", 6, rhythm / 2, pow(3), false);
            moveJoint(leftKnee, "2o", "1o", [6, 8], rhythm / 2, pow(3));
            moveJoint(leftFoot, "0o", "2.5o", 8, rhythm / 2, pow(3));

            moveJoint(lower, "0.5o", "2o", 1, rhythm / 2, pow(3));
            moveJoint(middle, "0.5o", "2o", [0, 1], rhythm / 2, pow(3));
            moveJoint(neck, "1o", "2o", 0, rhythm / 2, pow(3));
            moveJoint(head, "1.5o", "2o", [], rhythm / 2, pow(3));

            moveJoint(leftShoulder, "0.5o", "2.5o", 2, rhythm / 2, pow(1), false);
            moveJoint(leftElbow, "-.5o", "2.5o", [2, 4], rhythm / 2, pow(1), false);
            moveJoint(leftHand, "0.5o", "2.5o", 4, rhythm / 2, pow(1), false);

            moveJoint(rightShoulder, "1o", "0.5o", 3, rhythm / 2, pow(1), false);
            moveJoint(rightElbow, "0.5o", "2.5o", [3, 5], rhythm / 2, pow(1), false);
            moveJoint(rightHand, "0.5o", "0.5o", 5, rhythm / 2, pow(1), false);

        }, elapsed + rhythm / 2);
        elapsed += rhythm;
        if (resetTrigger)
            return;

        setTimeout(function () {
            moveJoint(head, 50, 40, [], rhythm, pow(1), false);
            moveJoint(neck, 50, 44, 0, rhythm, pow(1), false);
            moveJoint(middle, 50, 55, [0, 1], rhythm, pow(1), false);
            moveJoint(lower, 50, 63, 1, rhythm, pow(1), false);
            moveJoint(leftShoulder, 52, 46.5, 2, rhythm, pow(1), false);
            moveJoint(leftElbow, 55, 56, [2, 4], rhythm, pow(1), false);
            moveJoint(leftHand, 55.5, 67, 4, rhythm, pow(1), false);
            moveJoint(rightShoulder, 48, 46.5, 3, rhythm, pow(1), false);
            moveJoint(rightElbow, 45, 56, [3, 5], rhythm, pow(1), false);
            moveJoint(rightHand, 44.5, 67, 5, rhythm, pow(1), false);
            moveJoint(leftHip, 50.5, 64, 6, rhythm, pow(1), false);
            moveJoint(leftKnee, 52.5, 77, [6, 8], rhythm, pow(1), false);
            moveJoint(leftFoot, 53.5, 88, 8, rhythm, pow(1), false);
            moveJoint(rightHip, 49.5, 64, 7, rhythm, pow(1), false);
            moveJoint(rightKnee, 47.5, 77, [7, 9], rhythm, pow(1), false);
            moveJoint(rightFoot, 46.5, 88, 9, rhythm, pow(1), false);
        }, elapsed + rhythm);
        elapsed += 2 * rhythm;

        intermediate = elapsed;
    }

    function dance(rhythm = 300) {
        timePassed = performance.now() - scriptStart;
        if (resetTrigger)
            return;
        armWave(rhythm / 2);
        timePassed = intermediate;
        if (resetTrigger)
            return;
        setTimeout(sidestep, timePassed, rhythm);
    }

    function reset(rhythm = 300) {
        moveJoint(head, 50, 40, [], rhythm, pow(1), false, false, true);
        moveJoint(neck, 50, 44, 0, rhythm, pow(1), false, false, true);
        moveJoint(middle, 50, 55, [0, 1], rhythm, pow(1), false, false, true);
        moveJoint(lower, 50, 63, 1, rhythm, pow(1), false, false, true);
        moveJoint(leftShoulder, 52, 46.5, 2, rhythm, pow(1), false, false, true);
        moveJoint(leftElbow, 55, 56, [2, 4], rhythm, pow(1), false, false, true);
        moveJoint(leftHand, 55.5, 67, 4, rhythm, pow(1), false, false, true);
        moveJoint(rightShoulder, 48, 46.5, 3, rhythm, pow(1), false, false, true);
        moveJoint(rightElbow, 45, 56, [3, 5], rhythm, pow(1), false, false, true);
        moveJoint(rightHand, 44.5, 67, 5, rhythm, pow(1), false, false, true);
        moveJoint(leftHip, 50.5, 64, 6, rhythm, pow(1), false, false, true);
        moveJoint(leftKnee, 52.5, 77, [6, 8], rhythm, pow(1), false, false, true);
        moveJoint(leftFoot, 53.5, 88, 8, rhythm, pow(1), false, false, true);
        moveJoint(rightHip, 49.5, 64, 7, rhythm, pow(1), false, false, true);
        moveJoint(rightKnee, 47.5, 77, [7, 9], rhythm, pow(1), false, false, true);
        moveJoint(rightFoot, 46.5, 88, 9, rhythm, pow(1), false, false, true);
    }

    setTimeout(function () {

        dance(rhythm);

        let danceInterval = setInterval(function () {
            dance(rhythm);
        }, rhythm * 15);
        setTimeout(function () {
            clearInterval(danceInterval);
            resetTrigger = 1;
            setTimeout(reset, 0, rhythm);
        }, timer);
    }, startOffset);
}