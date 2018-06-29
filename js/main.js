function mainViewModel() {
    var self = this;
    self.tiers = ["Target", "Location", "Kill", "Add Item", "Use Item",
        "Browser", "Audio", "Stop Audio", "Dialog", "Cinematic", "Looks", "Animation"];

    self.missionTitle = ko.observable('');
    self.debugMode = ko.observable(false);
    self.debugTier = ko.observable(0);
    self.userTiers = ko.observableArray([]);
    self.selectedTier = ko.observable();
    self.contextMenuItem = {};

    self.userTiers.subscribe(function () {
        if (!self.userTiers().length) {
            $("#context-menu").hide();
            $('#debugTier .select-dropdown').val('');
            $('#debugTier ul li span').text('');
        }

        for (var i = 0; i < self.userTiers().length; i++) {
            self.userTiers()[i].index(i + 1);
        }
    });

    self.addTier = function (data, event, suppressChangeTier) {
        var tier = {};
        tier.index = new ko.observable(self.userTiers().length + 1);
        tier.text = data;
        tier.type = tier.text.toLowerCase();

        var tierData = {};
        tierData.description = new ko.observable();
        tierData.faction = new ko.observable();
        tierData.gender = new ko.observable();
        tierData.skipPrev = new ko.observable();
        tierData.noBell = new ko.observable();

        // Create tier data
        switch (data) {
            case "Target":
                tierData.targetName = new ko.observable();
                tierData.isOffensiveTarget = new ko.observable(false);
                break;

            case "Location":
                tierData.playField = new ko.observable(1000);
                tierData.X_Coord = new ko.observable();
                tierData.Y_Coord = new ko.observable();
                tierData.Z_Coord = new ko.observable();
                tierData.distance = new ko.observable();
                tierData.yDistance = new ko.observable();
                tierData.waypointName = new ko.observable();
                tierData.ghost = new ko.observable();
                break;

            case "Kill":
                tierData.targetName = new ko.observable();
                tierData.targetKills = new ko.observable();
                break;

            case "Add Item":
                tier.type = "additem";
                tierData.itemName = new ko.observable();
                tierData.autoUseItem = new ko.observable();
                break;

            case "Use Item":
                tier.type = "useitem";
                tierData.itemName = new ko.observable();
                break;

            case "Browser":
                tierData.URL = new ko.observable('');
                tierData.browserTitle = new ko.observable();
                tierData.hideAddress = new ko.observable();
                tierData.width = new ko.observable();
                tierData.height = new ko.observable();
                tierData.response = new ko.observable();
                break;

            case "Audio":
                tierData.URL = new ko.observable();
                tierData.preload = new ko.observable();
                tierData.volume = new ko.observable();
                tierData.loop = new ko.observable();
                tierData.muteMusic = new ko.observable();
                break;

            case "Stop Audio":
                tier.type = "audio";
                break;

            case "Dialog":
                tierData.speed = new ko.observable();
                tierData.contAudio = new ko.observable();
                tierData.dialogData = new ko.observableArray([]);
                break;

            case "Cinematic":
                tierData.playField = new ko.observable(1000);
                tierData.contAudio = new ko.observable();
                tierData.cinematicData = new ko.observableArray([]);
                tierData.selectedTier = new ko.observable();

                tierData.cinematicData.subscribe(function () {
                    if (!tierData.cinematicData().length) {
                        $("#context-menu").hide();
                    }

                    for (var i = 0; i < tierData.cinematicData().length; i++) {
                        tierData.cinematicData()[i].index(i + 1);
                    }
                });
                break;

            case "Looks":
                tierData.playField = new ko.observable();
                tierData.X_Coord = new ko.observable();
                tierData.Y_Coord = new ko.observable();
                tierData.Z_Coord = new ko.observable();
                tierData.distance = new ko.observable();
                tierData.yDistance = new ko.observable();
                tierData.targetQty = new ko.observable();
                tierData.looksTarget = new ko.observable();
                tierData.keepLooks = new ko.observable();
                tierData.resetLooks = new ko.observable;
                tierData.invisible = new ko.observable();
                tierData.delay = new ko.observable();
                tierData.looksData = new ko.observableArray([]);
                break;

            case "Animation":
                tierData.playField = new ko.observable();
                tierData.X_Coord = new ko.observable();
                tierData.Y_Coord = new ko.observable();
                tierData.Z_Coord = new ko.observable();
                tierData.distance = new ko.observable();
                tierData.yDistance = new ko.observable();
                tierData.targetQty = new ko.observable();
                tierData.animTarget = new ko.observable();
                tierData.animData = new ko.observableArray([]);
                break;
        }

        tier.tierData = tierData;
        self.userTiers.push(tier);

        if (!suppressChangeTier) {
            self.selectedTier(self.userTiers()[self.userTiers().length - 1]);
            $("#tiersList li").removeClass("active");
            $("#tiersList li:last").addClass("active");
        }

        $(".context-menu").contextmenu({
            target: '#context-menu',
            onItem: function (context, event) {
                event.preventDefault();

                if ($(event.currentTarget).attr('id') == "moveLeft") {
                    self.moveLeft("tiers");
                } else if ($(event.currentTarget).attr('id') == "moveRight") {
                    self.moveRight("tiers");
                } else if ($(event.currentTarget).attr('id') == "deleteTier") {
                    self.deleteTier("tiers");
                }
            }
        });
    }

    self.changeTier = function (data, event, cinematic) {
        if (cinematic) {
            if (cinematic.selectedTier() == data) return;
            cinematic.selectedTier(data);
            $("#cinematicData li").removeClass("active");
            $(event.currentTarget).addClass("active");
        } else {
            if (self.selectedTier() == data) return;
            self.selectedTier(data);
            $("#tiersList li").removeClass("active");
            $(event.currentTarget).addClass("active");

            if (data.type == "cinematic") {
                if (data.tierData.selectedTier()) {
                    var index = data.tierData.selectedTier().index();
                    $("#cinematicData li:nth-child(" + index + ")").addClass("active");
                }

                $(".context-menu").contextmenu({
                    target: '#context-menu',
                    onItem: function (context, event) {
                        event.preventDefault();

                        if ($(event.currentTarget).attr('id') == "moveLeft") {
                            self.moveLeft("cinematic");
                        } else if ($(event.currentTarget).attr('id') == "moveRight") {
                            self.moveRight("cinematic");
                        } else if ($(event.currentTarget).attr('id') == "deleteTier") {
                            self.deleteTier("cinematic");
                        }
                    }
                });
            }
        }
    }

    self.contextMenuShown = function (data) {
        self.contextMenuItem = data;
    }

    self.moveLeft = function (parent) {
        if (self.contextMenuItem.index() <= 1) return;

        if (parent == "tiers") {
            self.userTiers.swap(self.contextMenuItem.index() - 1, self.contextMenuItem.index() - 2);
        }
        else if (parent == "cinematic") {
            self.selectedTier().tierData.cinematicData.swap(self.contextMenuItem.index() - 1, self.contextMenuItem.index() - 2);
        }
    }

    self.moveRight = function (parent) {
        if (parent == "tiers") {
            if (self.contextMenuItem.index() == self.userTiers().length) return;
            self.userTiers.swap(self.contextMenuItem.index() - 1, self.contextMenuItem.index());
        }
        else if (parent == "cinematic") {
            if (self.contextMenuItem.index() == self.selectedTier().tierData.cinematicData().length) return;
            self.selectedTier().tierData.cinematicData.swap(self.contextMenuItem.index() - 1, self.contextMenuItem.index());
        }
    }

    self.deleteTier = function (parent) {
        if (parent == "tiers") {
            self.userTiers.remove(self.contextMenuItem);
            self.selectedTier(self.userTiers()[self.userTiers().length - 1]);
            $("#tiersList li").removeClass("active");
            $("#tiersList li:last").addClass("active");

            if (self.selectedTier() && self.selectedTier().type == "cinematic") {
                if (self.selectedTier().tierData.selectedTier()) {
                    var index = self.selectedTier().tierData.selectedTier().index();
                    $("#cinematicData li:nth-child(" + index + ")").addClass("active");
                }

                $(".context-menu").contextmenu({
                    target: '#context-menu',
                    onItem: function (context, event) {
                        event.preventDefault();

                        if ($(event.currentTarget).attr('id') == "moveLeft") {
                            self.moveLeft("cinematic");
                        } else if ($(event.currentTarget).attr('id') == "moveRight") {
                            self.moveRight("cinematic");
                        } else if ($(event.currentTarget).attr('id') == "deleteTier") {
                            self.deleteTier("cinematic");
                        }
                    }
                });
            }
        }
        else if (parent == "cinematic") {
            self.selectedTier().tierData.cinematicData.remove(self.contextMenuItem);
            var selected = self.selectedTier().tierData.cinematicData()[self.selectedTier().tierData.cinematicData().length - 1];
            self.selectedTier().tierData.selectedTier(selected);
            $("#cinematicData li").removeClass("active");
            $("#cinematicData li:last").addClass("active");
        }
    }

    self.addDialogData = function (data, event, type, suppressAnimations) {
        data.suppressAnimations = suppressAnimations;
        var dialogData = {};

        switch (type) {
            case "dialog_line":
                dialogData.faction = new ko.observable();
                dialogData.gender = new ko.observable();
                dialogData.line = new ko.observable('');
                dialogData.duration = new ko.observable();
                break;

            case "dialog_fadeout":
            case "dialog_fadein":
                dialogData.duration = new ko.observable();
                break;

            case "dialog_audio":
                dialogData.faction = new ko.observable();
                dialogData.gender = new ko.observable();
                dialogData.URL = new ko.observable();
                dialogData.volume = new ko.observable();
                break;
        }

        data.dialogData.push({type: type, data: dialogData});
    }

    self.addCinematicData = function (data, event, type, suppressAnimations) {
        data.suppressAnimations = suppressAnimations;
        var cinematicData = {};
        var index = new ko.observable(data.cinematicData().length + 1);

        switch (type) {
            case "cinematic_dialog_line":
                var text = "Dialog Line";
                cinematicData.faction = new ko.observable();
                cinematicData.gender = new ko.observable();
                cinematicData.line = new ko.observable('');
                cinematicData.duration = new ko.observable();
                break;

            case "cinematic_fadeout":
                var text = "Fade Out";
                cinematicData.duration = new ko.observable();
                break;

            case "cinematic_fadein":
                var text = "Fade In";
                cinematicData.duration = new ko.observable();
                break;

            case "cinematic_audio":
                var text = "Audio";
                cinematicData.faction = new ko.observable();
                cinematicData.gender = new ko.observable();
                cinematicData.URL = new ko.observable();
                cinematicData.volume = new ko.observable();
                break;

            case "cinematic_camera":
                var text = "Camera Movement";
                cinematicData.duration = new ko.observable();
                cinematicData.posX = new ko.observable();
                cinematicData.posY = new ko.observable();
                cinematicData.posZ = new ko.observable();
                cinematicData.targetX = new ko.observable();
                cinematicData.targetY = new ko.observable();
                cinematicData.targetZ = new ko.observable();
                cinematicData.ease = new ko.observable();
                break;

            case "cinematic_facetarget":
                var text = "Face Target";
                break;

            case "cinematic_facenpc":
                var text = "Face NPC";
                cinematicData.name = new ko.observable();
                break;

            case "cinematic_facecoords":
                var text = "Face Coordinates";
                cinematicData.X_Coord = new ko.observable();
                cinematicData.Z_Coord = new ko.observable();
                break;

            case "cinematic_looks":
                var text = "Looks";
                cinematicData.description = new ko.observable();
                cinematicData.faction = new ko.observable();
                cinematicData.gender = new ko.observable();
                cinematicData.playField = new ko.observable();
                cinematicData.X_Coord = new ko.observable();
                cinematicData.Y_Coord = new ko.observable();
                cinematicData.Z_Coord = new ko.observable();
                cinematicData.distance = new ko.observable();
                cinematicData.yDistance = new ko.observable();
                cinematicData.targetQty = new ko.observable();
                cinematicData.looksTarget = new ko.observable();
                cinematicData.keepLooks = new ko.observable();
                cinematicData.resetLooks = new ko.observable;
                cinematicData.invisible = new ko.observable();
                cinematicData.delay = new ko.observable();
                cinematicData.looksData = new ko.observableArray([]);
                break;

            case "cinematic_animation":
                var text = "Animation";
                cinematicData.description = new ko.observable();
                cinematicData.faction = new ko.observable();
                cinematicData.gender = new ko.observable();
                cinematicData.playField = new ko.observable();
                cinematicData.X_Coord = new ko.observable();
                cinematicData.Y_Coord = new ko.observable();
                cinematicData.Z_Coord = new ko.observable();
                cinematicData.distance = new ko.observable();
                cinematicData.yDistance = new ko.observable();
                cinematicData.targetQty = new ko.observable();
                cinematicData.animTarget = new ko.observable();
                cinematicData.animData = new ko.observableArray([]);
                break;
        }

        data.cinematicData.push({index: index, type: type, text: text, data: cinematicData});

        if (!suppressAnimations) {
            data.selectedTier(data.cinematicData()[data.cinematicData().length - 1]);
            $("#cinematicData li").removeClass("active");
            $("#cinematicData li:last").addClass("active");
        }

        $(".context-menu").contextmenu({
            target: '#context-menu',
            onItem: function (context, event) {
                event.preventDefault();

                if ($(event.currentTarget).attr('id') == "moveLeft") {
                    self.moveLeft("cinematic");
                } else if ($(event.currentTarget).attr('id') == "moveRight") {
                    self.moveRight("cinematic");
                } else if ($(event.currentTarget).attr('id') == "deleteTier") {
                    self.deleteTier("cinematic");
                }
            }
        });
    }

    self.addLooksData = function (data, event, suppressAnimations) {
        data.suppressAnimations = suppressAnimations;
        var looksData = {};
        looksData.description = new ko.observable();
        looksData.rdbid = new ko.observable();
        looksData.removeLooks = new ko.observable();
        looksData.conf = new ko.observable();
        data.looksData.push(looksData);
    }

    self.addAnimData = function (data, event, suppressAnimations) {
        data.suppressAnimations = suppressAnimations;
        var animData = {};
        animData.name = new ko.observable();
        animData.duration = new ko.observable();
        data.animData.push(animData);
    }

    self.generateXML = function () {
        // Create the document, attach the root mission element
        var doc = new marknote.Document();
        var pi = new marknote.ProcessingInstruction("xml");
        pi.setAttributeValue("version", "1.0");
        doc.addProcessingInstruction(pi);

        var missionTag = new marknote.Element("mission");
        doc.setRootElement(missionTag);
        missionTag.setAttribute("title", self.missionTitle());

        if (self.debugMode()) {
            missionTag.setAttribute("debugMode", "true");

            if (self.debugTier()) {
                missionTag.setAttribute("debugTier", self.debugTier());
            } else {
                missionTag.setAttribute("debugTier", "1");
            }
        }

        // Loop through tiers, create each element and attributes and attach to mission

        for (var i = 0; i < self.userTiers().length; i++) {
            var tier = self.userTiers()[i];
            var tierTag = new marknote.Element("tier");
            tierTag.setAttribute("type", tier.type);
            if (tier.tierData.description()) tierTag.setAttribute("description", tier.tierData.description());
            if (tier.tierData.faction()) tierTag.setAttribute("faction", tier.tierData.faction());
            if (tier.tierData.gender()) tierTag.setAttribute("gender", tier.tierData.gender());
            if (tier.tierData.skipPrev()) tierTag.setAttribute("skipPrev", "true");
            if (tier.tierData.noBell()) tierTag.setAttribute("noBell", "true");

            switch (tier.text) {
                case "Target":
                    tierTag.setAttribute("targetName", tier.tierData.targetName());
                    tierTag.setAttribute("isOffensiveTarget", tier.tierData.isOffensiveTarget());
                    break;

                case "Location":
                    tierTag.setAttribute("playField", tier.tierData.playField());
                    tierTag.setAttribute("x", tier.tierData.X_Coord());
                    tierTag.setAttribute("y", tier.tierData.Y_Coord());
                    tierTag.setAttribute("z", tier.tierData.Z_Coord());
                    tierTag.setAttribute("distance", tier.tierData.distance());
                    tierTag.setAttribute("yDistance", tier.tierData.yDistance());
                    if (tier.tierData.waypointName()) tierTag.setAttribute("waypointName", tier.tierData.waypointName());
                    if (tier.tierData.ghost()) tierTag.setAttribute("ghost", "true");
                    break;

                case "Kill":
                    tierTag.setAttribute("targetName", tier.tierData.targetName());
                    tierTag.setAttribute("targetKills", tier.tierData.targetKills());
                    break;

                case "Add Item":
                    tierTag.setAttribute("itemName", tier.tierData.itemName());
                    if (tier.tierData.autoUseItem()) tierTag.setAttribute("autoUseItem", "true");
                    break;

                case "Use Item":
                    tierTag.setAttribute("itemName", tier.tierData.itemName());
                    break;

                case "Browser":
                    tierTag.setAttribute("url", tier.tierData.URL());
                    if (tier.tierData.browserTitle()) tierTag.setAttribute("browserTitle", tier.tierData.browserTitle());
                    if (tier.tierData.hideAddress()) tierTag.setAttribute("hideAddress", "true");
                    if (tier.tierData.width()) tierTag.setAttribute("width", tier.tierData.width());
                    if (tier.tierData.height()) tierTag.setAttribute("height", tier.tierData.height());
                    if (tier.tierData.response()) tierTag.setAttribute("response", tier.tierData.response());
                    break;

                case "Audio":
                    tierTag.setAttribute("url", tier.tierData.URL());
                    if (tier.tierData.preload()) tierTag.setAttribute("preload", tier.tierData.preload());
                    if (tier.tierData.volume()) tierTag.setAttribute("volume", tier.tierData.volume());
                    if (tier.tierData.loop()) tierTag.setAttribute("loop", "true");
                    if (tier.tierData.muteMusic()) tierTag.setAttribute("muteMusic", "true");
                    break;

                case "Stop Audio":
                    tierTag.setAttribute("stop", "true");
                    break;

                case "Dialog":
                    if (tier.tierData.speed()) tierTag.setAttribute("speed", tier.tierData.speed());
                    if (tier.tierData.contAudio()) tierTag.setAttribute("contAudio", "true");

                    for (var j = 0; j < tier.tierData.dialogData().length; j++) {
                        var dialog = tier.tierData.dialogData()[j];
                        var dialogTag = new marknote.Element("dialog");

                        switch (dialog.type) {
                            case "dialog_line":
                                dialogTag.setAttribute("type", "dialog");
                                dialogTag.setAttribute("line", dialog.data.line());
                                if (dialog.data.duration()) dialogTag.setAttribute("duration", dialog.data.duration());
                                if (dialog.data.faction()) dialogTag.setAttribute("faction", dialog.data.faction());
                                if (dialog.data.gender()) dialogTag.setAttribute("gender", dialog.data.gender());
                                break;

                            case "dialog_fadeout":
                                dialogTag.setAttribute("type", "fadeout");
                                dialogTag.setAttribute("duration", dialog.data.duration());
                                break;

                            case "dialog_fadein":
                                dialogTag.setAttribute("type", "fadein");
                                dialogTag.setAttribute("duration", dialog.data.duration());
                                break;

                            case "dialog_audio":
                                dialogTag.setAttribute("type", "audio");
                                dialogTag.setAttribute("url", dialog.data.URL());
                                if (dialog.data.volume()) dialogTag.setAttribute("volume", dialog.data.volume());
                                if (dialog.data.faction()) dialogTag.setAttribute("faction", dialog.data.faction());
                                if (dialog.data.gender()) dialogTag.setAttribute("gender", dialog.data.gender());
                                break;
                        }

                        tierTag.addChildElement(dialogTag);
                    }
                    break;

                case "Cinematic":
                    tierTag.setAttribute("playField", tier.tierData.playField());
                    if (tier.tierData.contAudio()) tierTag.setAttribute("contAudio", "true");

                    for (var j = 0; j < tier.tierData.cinematicData().length; j++) {
                        var cinematic = tier.tierData.cinematicData()[j];
                        var cinematicTag = new marknote.Element("cinematic");

                        switch (cinematic.type) {
                            case "cinematic_dialog_line":
                                cinematicTag.setAttribute("type", "dialog");
                                cinematicTag.setAttribute("line", cinematic.data.line());
                                if (cinematic.data.duration()) cinematicTag.setAttribute("duration", cinematic.data.duration());
                                if (cinematic.data.faction()) cinematicTag.setAttribute("faction", cinematic.data.faction());
                                if (cinematic.data.gender()) cinematicTag.setAttribute("gender", cinematic.data.gender());
                                break;

                            case "cinematic_fadeout":
                                cinematicTag.setAttribute("type", "fadeout");
                                cinematicTag.setAttribute("duration", cinematic.data.duration());
                                break;

                            case "cinematic_fadein":
                                cinematicTag.setAttribute("type", "fadein");
                                cinematicTag.setAttribute("duration", cinematic.data.duration());
                                break;

                            case "cinematic_audio":
                                cinematicTag.setAttribute("type", "audio");
                                cinematicTag.setAttribute("url", cinematic.data.URL());
                                if (cinematic.data.volume()) cinematicTag.setAttribute("volume", cinematic.data.volume());
                                if (cinematic.data.faction()) cinematicTag.setAttribute("faction", cinematic.data.faction());
                                if (cinematic.data.gender()) cinematicTag.setAttribute("gender", cinematic.data.gender());
                                break;

                            case "cinematic_camera":
                                cinematicTag.setAttribute("type", "camera");
                                cinematicTag.setAttribute("duration", cinematic.data.duration());
                                cinematicTag.setAttribute("posX", cinematic.data.posX());
                                cinematicTag.setAttribute("posY", cinematic.data.posY());
                                cinematicTag.setAttribute("posZ", cinematic.data.posZ());
                                cinematicTag.setAttribute("targetX", cinematic.data.targetX());

                                if (cinematic.data.targetX() != -99) {
                                    cinematicTag.setAttribute("targetY", cinematic.data.targetY());
                                    cinematicTag.setAttribute("targetZ", cinematic.data.targetZ());
                                }

                                if (cinematic.data.ease()) cinematicTag.setAttribute("ease", cinematic.data.ease());
                                break;

                            case "cinematic_facetarget":
                                cinematicTag.setAttribute("type", "facetarget");
                                break;

                            case "cinematic_facenpc":
                                cinematicTag.setAttribute("type", "facenpc");
                                cinematicTag.setAttribute("name", cinematic.data.name());
                                break;

                            case "cinematic_facecoords":
                                cinematicTag.setAttribute("type", "facecoords");
                                cinematicTag.setAttribute("x", cinematic.data.X_Coord());
                                cinematicTag.setAttribute("z", cinematic.data.Z_Coord());
                                break;

                            case "cinematic_looks":
                                cinematicTag.setAttribute("type", "looks");
                                cinematicTag.setAttribute("looksTarget", cinematic.data.looksTarget());
                                if (cinematic.data.description()) cinematicTag.setAttribute("description", cinematic.data.description());
                                if (cinematic.data.targetQty()) cinematicTag.setAttribute("targetQty", cinematic.data.targetQty());
                                if (cinematic.data.delay()) cinematicTag.setAttribute("delay", cinematic.data.delay());
                                if (cinematic.data.keepLooks()) cinematicTag.setAttribute("keepLooks", "true");
                                if (cinematic.data.resetLooks()) cinematicTag.setAttribute("resetLooks", "true");
                                if (cinematic.data.invisible()) cinematicTag.setAttribute("invisible", "true");
                                if (cinematic.data.playField()) cinematicTag.setAttribute("playField", cinematic.data.playField());
                                if (cinematic.data.X_Coord()) cinematicTag.setAttribute("x", cinematic.data.X_Coord());
                                if (cinematic.data.Y_Coord()) cinematicTag.setAttribute("y", cinematic.data.Y_Coord());
                                if (cinematic.data.Z_Coord()) cinematicTag.setAttribute("z", cinematic.data.Z_Coord());
                                if (cinematic.data.distance()) cinematicTag.setAttribute("distance", cinematic.data.distance());
                                if (cinematic.data.yDistance()) cinematicTag.setAttribute("yDistance", cinematic.data.yDistance());

                                for (var k = 0; k < cinematic.data.looksData().length; k++) {
                                    var looks = cinematic.data.looksData()[k];
                                    var looksTag = new marknote.Element("looks");
                                    looksTag.setAttribute("rdbid", looks.rdbid());
                                    if (looks.description()) looksTag.setAttribute("description", looks.description());
                                    if (looks.removeLooks()) looksTag.setAttribute("removeLooks", "true");
                                    if (looks.conf()) looksTag.setAttribute("configuration", looks.conf());
                                    cinematicTag.addChildElement(looksTag);
                                }
                                break;

                            case "cinematic_animation":
                                cinematicTag.setAttribute("type", "animation");
                                cinematicTag.setAttribute("animTarget", cinematic.data.animTarget());
                                if (cinematic.data.description()) cinematicTag.setAttribute("description", cinematic.data.description());
                                if (cinematic.data.targetQty()) cinematicTag.setAttribute("targetQty", cinematic.data.targetQty());
                                if (cinematic.data.playField()) cinematicTag.setAttribute("playField", cinematic.data.playField());
                                if (cinematic.data.X_Coord()) cinematicTag.setAttribute("x", cinematic.data.X_Coord());
                                if (cinematic.data.Y_Coord()) cinematicTag.setAttribute("y", cinematic.data.Y_Coord());
                                if (cinematic.data.Z_Coord()) cinematicTag.setAttribute("z", cinematic.data.Z_Coord());
                                if (cinematic.data.distance()) cinematicTag.setAttribute("distance", cinematic.data.distance());
                                if (cinematic.data.yDistance()) cinematicTag.setAttribute("yDistance", cinematic.data.yDistance());

                                for (var k = 0; k < cinematic.data.animData().length; k++) {
                                    var animation = cinematic.data.animData()[k];
                                    var animTag = new marknote.Element("animation");
                                    animTag.setAttribute("name", animation.name());
                                    if (animation.duration()) animTag.setAttribute("duration", animation.duration());
                                    cinematicTag.addChildElement(animTag);
                                }
                                break;
                        }

                        tierTag.addChildElement(cinematicTag);
                    }
                    break;

                case "Looks":
                    tierTag.setAttribute("looksTarget", tier.tierData.looksTarget());
                    if (tier.tierData.targetQty()) tierTag.setAttribute("targetQty", tier.tierData.targetQty());
                    if (tier.tierData.delay()) tierTag.setAttribute("delay", tier.tierData.delay());
                    if (tier.tierData.keepLooks()) tierTag.setAttribute("keepLooks", "true");
                    if (tier.tierData.resetLooks()) tierTag.setAttribute("resetLooks", "true");
                    if (tier.tierData.invisible()) tierTag.setAttribute("invisible", "true");
                    if (tier.tierData.playField()) tierTag.setAttribute("playField", tier.tierData.playField());
                    if (tier.tierData.X_Coord()) tierTag.setAttribute("x", tier.tierData.X_Coord());
                    if (tier.tierData.Y_Coord()) tierTag.setAttribute("y", tier.tierData.Y_Coord());
                    if (tier.tierData.Z_Coord()) tierTag.setAttribute("z", tier.tierData.Z_Coord());
                    if (tier.tierData.distance()) tierTag.setAttribute("distance", tier.tierData.distance());
                    if (tier.tierData.yDistance()) tierTag.setAttribute("yDistance", tier.tierData.yDistance());

                    for (var j = 0; j < tier.tierData.looksData().length; j++) {
                        var looks = tier.tierData.looksData()[j];
                        var looksTag = new marknote.Element("looks");
                        looksTag.setAttribute("rdbid", looks.rdbid());
                        if (looks.description()) looksTag.setAttribute("description", looks.description());
                        if (looks.removeLooks()) looksTag.setAttribute("removeLooks", "true");
                        if (looks.conf()) looksTag.setAttribute("configuration", looks.conf());
                        tierTag.addChildElement(looksTag);
                    }
                    break;

                case "Animation":
                    tierTag.setAttribute("animTarget", tier.tierData.animTarget());
                    if (tier.tierData.targetQty()) tierTag.setAttribute("targetQty", tier.tierData.targetQty());
                    if (tier.tierData.playField()) tierTag.setAttribute("playField", tier.tierData.playField());
                    if (tier.tierData.X_Coord()) tierTag.setAttribute("x", tier.tierData.X_Coord());
                    if (tier.tierData.Y_Coord()) tierTag.setAttribute("y", tier.tierData.Y_Coord());
                    if (tier.tierData.Z_Coord()) tierTag.setAttribute("z", tier.tierData.Z_Coord());
                    if (tier.tierData.distance()) tierTag.setAttribute("distance", tier.tierData.distance());
                    if (tier.tierData.yDistance()) tierTag.setAttribute("yDistance", tier.tierData.yDistance());

                    for (var j = 0; j < tier.tierData.animData().length; j++) {
                        var animation = tier.tierData.animData()[j];
                        var animTag = new marknote.Element("animation");
                        animTag.setAttribute("name", animation.name());
                        if (animation.duration()) animTag.setAttribute("duration", animation.duration());
                        tierTag.addChildElement(animTag);
                    }
                    break;
            }

            missionTag.addChildElement(tierTag);
        }

        return doc.toString();
    }

    self.exportToFile = function () {
        var XML = self.generateXML();
        var blob = new Blob([XML], {type: "text/xml"});
        var missionTitle = self.missionTitle().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });
        missionTitle = missionTitle.replace(/ /g, '') + ".xml";
        if (missionTitle == ".xml") missionTitle = "mission.xml";
        saveAs(blob, missionTitle);
    }

    self.readFileContents = function (data, event) {
        var file = event.currentTarget.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");

            reader.onload = function (event) {
                self.importXML(event.target.result);
            }
            reader.onerror = function (event) {
                alert("Error reading file!");
            }
        }
    }

    self.importXML = function (XML) {
        var parser = new marknote.Parser();
        var doc = parser.parse(XML);
        var missionTag = doc.getRootElement();
        if (missionTag.getName() != "mission") {
            alert("Invalid XML file!");
            return;
        }

        self.missionTitle(missionTag.getAttributeValue("title"));
        var debugMode = missionTag.getAttributeValue("debugMode");
        debugMode = (debugMode == "true") ? true : false;
        self.debugMode(debugMode);
        self.userTiers([]);
        var tiers = missionTag.getChildElements();

        // Read each tier

        for (var i = 0; i < tiers.length; i++) {
            var tierTag = tiers[i];
            var type = tierTag.getAttributeValue("type");

            switch (type) {
                case "target":
                    self.addTier("Target", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.targetName(tierTag.getAttributeValue("targetName"));
                    var isOffensiveTarget = tierTag.getAttributeValue("isOffensiveTarget");
                    isOffensiveTarget = isOffensiveTarget == "true" ? true : false;
                    tier.tierData.isOffensiveTarget(isOffensiveTarget);
                    break;

                case "location":
                    self.addTier("Location", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.playField(tierTag.getAttributeValue("playField"));
                    tier.tierData.X_Coord(tierTag.getAttributeValue("x"));
                    tier.tierData.Y_Coord(tierTag.getAttributeValue("y"));
                    tier.tierData.Z_Coord(tierTag.getAttributeValue("z"));
                    tier.tierData.distance(tierTag.getAttributeValue("distance"));
                    tier.tierData.yDistance(tierTag.getAttributeValue("yDistance"));
                    tier.tierData.waypointName(tierTag.getAttributeValue("waypointName"));
                    var ghost = tierTag.getAttributeValue("ghost");
                    ghost = (ghost == "true") ? true : false;
                    tier.tierData.ghost(ghost);
                    break;

                case "kill":
                    self.addTier("Kill", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.targetName(tierTag.getAttributeValue("targetName"));
                    tier.tierData.targetKills(tierTag.getAttributeValue("targetKills"));
                    break;

                case "additem":
                    self.addTier("Add Item", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.itemName(tierTag.getAttributeValue("itemName"));
                    var autoUseItem = tierTag.getAttributeValue("autoUseItem");
                    autoUseItem = (autoUseItem == "true") ? true : false;
                    tier.tierData.autoUseItem(autoUseItem);
                    break;

                case "useitem":
                    self.addTier("Use Item", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.itemName(tierTag.getAttributeValue("itemName"));
                    break;

                case "browser":
                    self.addTier("Browser", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.URL(tierTag.getAttributeValue("url"));
                    tier.tierData.browserTitle(tierTag.getAttributeValue("browserTitle"));
                    var hideAddress = tierTag.getAttributeValue("hideAddress");
                    hideAddress = (hideAddress == "true") ? true : false;
                    tier.tierData.hideAddress(hideAddress);
                    tier.tierData.width(tierTag.getAttributeValue("width"));
                    tier.tierData.height(tierTag.getAttributeValue("height"));
                    tier.tierData.response(tierTag.getAttributeValue("response"));
                    break;

                case "audio":
                    if (tierTag.getAttributeValue("stop")) {
                        self.addTier("Stop Audio", null, true);
                        break;
                    }

                    self.addTier("Audio", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.URL(tierTag.getAttributeValue("url"));
                    tier.tierData.preload(tierTag.getAttributeValue("preload"));
                    tier.tierData.volume(tierTag.getAttributeValue("volume"));
                    var loop = tierTag.getAttributeValue("loop");
                    loop = (loop == "true") ? true : false;
                    tier.tierData.loop(loop);
                    var muteMusic = tierTag.getAttributeValue("muteMusic");
                    muteMusic = (muteMusic == "true") ? true : false;
                    tier.tierData.muteMusic(muteMusic);
                    break;

                case "dialog":
                    self.addTier("Dialog", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.speed(tierTag.getAttributeValue("speed"));
                    tier.tierData.contAudio(tierTag.getAttributeValue("contAudio"));
                    var dialogTags = tierTag.getChildElements();

                    for (var j = 0; j < dialogTags.length; j++) {
                        var dialogTag = dialogTags[j];
                        type = dialogTag.getAttributeValue("type");

                        switch (type) {
                            case "dialog":
                                self.addDialogData(tier.tierData, null, "dialog_line", true);
                                var dialogData = tier.tierData.dialogData()[tier.tierData.dialogData().length - 1].data;
                                dialogData.line(dialogTag.getAttributeValue("line"));
                                dialogData.duration(dialogTag.getAttributeValue("duration"));
                                dialogData.faction(dialogTag.getAttributeValue("faction"));
                                dialogData.gender(dialogTag.getAttributeValue("gender"));
                                break;

                            case "fadeout":
                                self.addDialogData(tier.tierData, null, "dialog_fadeout", true);
                                var dialogData = tier.tierData.dialogData()[tier.tierData.dialogData().length - 1].data;
                                dialogData.duration(dialogTag.getAttributeValue("duration"));
                                break;

                            case "fadein":
                                self.addDialogData(tier.tierData, null, "dialog_fadein", true);
                                var dialogData = tier.tierData.dialogData()[tier.tierData.dialogData().length - 1].data;
                                dialogData.duration(dialogTag.getAttributeValue("duration"));
                                break;

                            case "audio":
                                self.addDialogData(tier.tierData, null, "dialog_audio", true);
                                var dialogData = tier.tierData.dialogData()[tier.tierData.dialogData().length - 1].data;
                                dialogData.URL(dialogTag.getAttributeValue("url"));
                                dialogData.volume(dialogTag.getAttributeValue("volume"));
                                dialogData.faction(dialogTag.getAttributeValue("faction"));
                                dialogData.gender(dialogTag.getAttributeValue("gender"));
                                break;
                        }
                    }
                    break;

                case "cinematic":
                    self.addTier("Cinematic", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.playField(tierTag.getAttributeValue("playField"));
                    tier.tierData.contAudio(tierTag.getAttributeValue("contAudio"));
                    var cinematicTags = tierTag.getChildElements();

                    for (var j = 0; j < cinematicTags.length; j++) {
                        var cinematicTag = cinematicTags[j];
                        type = cinematicTag.getAttributeValue("type");

                        switch (type) {
                            case "dialog":
                                self.addCinematicData(tier.tierData, null, "cinematic_dialog_line", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.line(cinematicTag.getAttributeValue("line"));
                                cinematicData.duration(cinematicTag.getAttributeValue("duration"));
                                cinematicData.faction(cinematicTag.getAttributeValue("faction"));
                                cinematicData.gender(cinematicTag.getAttributeValue("gender"));
                                break;

                            case "fadeout":
                                self.addCinematicData(tier.tierData, null, "cinematic_fadeout", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.duration(cinematicTag.getAttributeValue("duration"));
                                break;

                            case "fadein":
                                self.addCinematicData(tier.tierData, null, "cinematic_fadein", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.duration(cinematicTag.getAttributeValue("duration"));
                                break;

                            case "audio":
                                self.addCinematicData(tier.tierData, null, "cinematic_audio", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.URL(cinematicTag.getAttributeValue("url"));
                                cinematicData.volume(cinematicTag.getAttributeValue("volume"));
                                cinematicData.faction(cinematicTag.getAttributeValue("faction"));
                                cinematicData.gender(cinematicTag.getAttributeValue("gender"));
                                break;

                            case "camera":
                                self.addCinematicData(tier.tierData, null, "cinematic_camera", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.duration(cinematicTag.getAttributeValue("duration"));
                                cinematicData.posX(cinematicTag.getAttributeValue("posX"));
                                cinematicData.posY(cinematicTag.getAttributeValue("posY"));
                                cinematicData.posZ(cinematicTag.getAttributeValue("posZ"));
                                cinematicData.targetX(cinematicTag.getAttributeValue("targetX"));
                                cinematicData.targetY(cinematicTag.getAttributeValue("targetY"));
                                cinematicData.targetZ(cinematicTag.getAttributeValue("targetZ"));
                                cinematicData.ease(cinematicTag.getAttributeValue("ease"));
                                break;

                            case "facetarget":
                                self.addCinematicData(tier.tierData, null, "cinematic_facetarget", true);
                                break;

                            case "facenpc":
                                self.addCinematicData(tier.tierData, null, "cinematic_facenpc", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.name(cinematicTag.getAttributeValue("name"));
                                break;

                            case "facecoords":
                                self.addCinematicData(tier.tierData, null, "cinematic_facecoords", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.X_Coord(cinematicTag.getAttributeValue("x"));
                                cinematicData.Z_Coord(cinematicTag.getAttributeValue("z"));
                                break;

                            case "looks":
                                self.addCinematicData(tier.tierData, null, "cinematic_looks", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.description(cinematicTag.getAttributeValue("description"));
                                cinematicData.faction(cinematicTag.getAttributeValue("faction"));
                                cinematicData.gender(cinematicTag.getAttributeValue("gender"));
                                cinematicData.looksTarget(cinematicTag.getAttributeValue("looksTarget"));
                                cinematicData.targetQty(cinematicTag.getAttributeValue("targetQty"));
                                cinematicData.delay(cinematicTag.getAttributeValue("delay"));
                                var keepLooks = cinematicTag.getAttributeValue("keepLooks");
                                keepLooks = (keepLooks == "true") ? true : false;
                                cinematicData.keepLooks(keepLooks);
                                var resetLooks = cinematicTag.getAttributeValue("resetLooks");
                                resetLooks = (resetLooks == "true") ? true : false;
                                cinematicData.resetLooks(resetLooks);
                                var invisible = cinematicTag.getAttributeValue("invisible");
                                invisible = (invisible == "true") ? true : false;
                                cinematicData.invisible(invisible);
                                cinematicData.playField(cinematicTag.getAttributeValue("playField"));
                                cinematicData.X_Coord(cinematicTag.getAttributeValue("x"));
                                cinematicData.Y_Coord(cinematicTag.getAttributeValue("y"));
                                cinematicData.Z_Coord(cinematicTag.getAttributeValue("z"));
                                cinematicData.distance(cinematicTag.getAttributeValue("distance"));
                                cinematicData.yDistance(cinematicTag.getAttributeValue("yDistance"));
                                var looksTags = cinematicTag.getChildElements();

                                for (var k = 0; k < looksTags.length; k++) {
                                    var looksTag = looksTags[k];
                                    self.addLooksData(cinematicData, null, true);
                                    var looksData = cinematicData.looksData()[cinematicData.looksData().length - 1];
                                    looksData.rdbid(looksTag.getAttributeValue("rdbid"));
                                    looksData.conf(looksTag.getAttributeValue("configuration"));
                                    looksData.description(looksTag.getAttributeValue("description"));
                                    var removeLooks = looksTag.getAttributeValue("removeLooks");
                                    removeLooks = (removeLooks == "true") ? true : false;
                                    looksData.removeLooks(removeLooks);
                                }
                                break;

                            case "animation":
                                self.addCinematicData(tier.tierData, null, "cinematic_animation", true);
                                var cinematicData = tier.tierData.cinematicData()[tier.tierData.cinematicData().length - 1].data;
                                cinematicData.description(cinematicTag.getAttributeValue("description"));
                                cinematicData.faction(cinematicTag.getAttributeValue("faction"));
                                cinematicData.gender(cinematicTag.getAttributeValue("gender"));
                                cinematicData.animTarget(cinematicTag.getAttributeValue("animTarget"));
                                cinematicData.targetQty(cinematicTag.getAttributeValue("targetQty"));
                                cinematicData.playField(cinematicTag.getAttributeValue("playField"));
                                cinematicData.X_Coord(cinematicTag.getAttributeValue("x"));
                                cinematicData.Y_Coord(cinematicTag.getAttributeValue("y"));
                                cinematicData.Z_Coord(cinematicTag.getAttributeValue("z"));
                                cinematicData.distance(cinematicTag.getAttributeValue("distance"));
                                cinematicData.yDistance(cinematicTag.getAttributeValue("yDistance"));
                                var animTags = cinematicTag.getChildElements();

                                for (var k = 0; k < animTags.length; k++) {
                                    var animTag = animTags[k];
                                    self.addAnimData(cinematicData, null, true);
                                    var animData = cinematicData.animData()[cinematicData.animData().length - 1];
                                    animData.name(animTag.getAttributeValue("name"));
                                    animData.duration(animTag.getAttributeValue("duration"));
                                }
                                break;
                        }
                    }
                    break;

                case "looks":
                    self.addTier("Looks", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.looksTarget(tierTag.getAttributeValue("looksTarget"));
                    tier.tierData.targetQty(tierTag.getAttributeValue("targetQty"));
                    tier.tierData.delay(tierTag.getAttributeValue("delay"));
                    var keepLooks = tierTag.getAttributeValue("keepLooks");
                    keepLooks = (keepLooks == "true") ? true : false;
                    tier.tierData.keepLooks(keepLooks);
                    var resetLooks = tierTag.getAttributeValue("resetLooks");
                    resetLooks = (resetLooks == "true") ? true : false;
                    tier.tierData.resetLooks(resetLooks);
                    var invisible = tierTag.getAttributeValue("invisible");
                    invisible = (invisible == "true") ? true : false;
                    tier.tierData.invisible(invisible);
                    tier.tierData.playField(tierTag.getAttributeValue("playField"));
                    tier.tierData.X_Coord(tierTag.getAttributeValue("x"));
                    tier.tierData.Y_Coord(tierTag.getAttributeValue("y"));
                    tier.tierData.Z_Coord(tierTag.getAttributeValue("z"));
                    tier.tierData.distance(tierTag.getAttributeValue("distance"));
                    tier.tierData.yDistance(tierTag.getAttributeValue("yDistance"));
                    var looksTags = tierTag.getChildElements();

                    for (var j = 0; j < looksTags.length; j++) {
                        var looksTag = looksTags[j];
                        self.addLooksData(tier.tierData, null, true);
                        var looksData = tier.tierData.looksData()[tier.tierData.looksData().length - 1];
                        looksData.rdbid(looksTag.getAttributeValue("rdbid"));
                        looksData.conf(looksTag.getAttributeValue("configuration"));
                        looksData.description(looksTag.getAttributeValue("description"));
                        var removeLooks = looksTag.getAttributeValue("removeLooks");
                        removeLooks = (removeLooks == "true") ? true : false;
                        looksData.removeLooks(removeLooks);
                    }
                    break;

                case "animation":
                    self.addTier("Animation", null, true);
                    var tier = self.userTiers()[self.userTiers().length - 1];
                    tier.tierData.description(tierTag.getAttributeValue("description"));
                    tier.tierData.faction(tierTag.getAttributeValue("faction"));
                    tier.tierData.gender(tierTag.getAttributeValue("gender"));
                    var skipPrev = tierTag.getAttributeValue("skipPrev");
                    skipPrev = (skipPrev == "true") ? true : false;
                    var noBell = tierTag.getAttributeValue("noBell");
                    noBell = (noBell == "true") ? true : false;
                    tier.tierData.skipPrev(skipPrev);
                    tier.tierData.noBell(noBell);
                    tier.tierData.animTarget(tierTag.getAttributeValue("animTarget"));
                    tier.tierData.targetQty(tierTag.getAttributeValue("targetQty"));
                    tier.tierData.playField(tierTag.getAttributeValue("playField"));
                    tier.tierData.X_Coord(tierTag.getAttributeValue("x"));
                    tier.tierData.Y_Coord(tierTag.getAttributeValue("y"));
                    tier.tierData.Z_Coord(tierTag.getAttributeValue("z"));
                    tier.tierData.distance(tierTag.getAttributeValue("distance"));
                    tier.tierData.yDistance(tierTag.getAttributeValue("yDistance"));
                    var animTags = tierTag.getChildElements();

                    for (var j = 0; j < animTags.length; j++) {
                        var animTag = animTags[j];
                        self.addAnimData(tier.tierData, null, true);
                        var animData = tier.tierData.animData()[tier.tierData.animData().length - 1];
                        animData.name(animTag.getAttributeValue("name"));
                        animData.duration(animTag.getAttributeValue("duration"));
                    }
                    break;
            }
        }

        // Select last tier
        self.selectedTier(self.userTiers()[self.userTiers().length - 1]);
        $("#tiersList li").removeClass("active");
        $("#tiersList li:last").addClass("active");
    }
}