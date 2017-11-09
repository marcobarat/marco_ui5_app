/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.CustomTile.
sap.ui.define(['jquery.sap.global', 'sap/m/Tile'],
        function (jQuery, Tile) {
            "use strict";

            var CustomTile = Tile.extend("myapp.controls.CustomTile", /** @lends sap.m.CustomTile.prototype */ {
                metadata: {

                    defaultAggregation: "content",
                    aggregations: {

                        content: {type: "sap.ui.core.Control", multiple: false}
                    },
                    designtime: true,
                    properties: {
                        backgroundColor: {type: "sap.ui.core.CSSColor", default: "transparent"}
                    }
                },
                onAfterRendering: function () {
                    Tile.prototype.onAfterRendering.apply(this, arguments);
                    jQuery.sap.byId(this.getId()).css("background-color", this.getBackgroundColor());
                }
            });

            return CustomTile;

        }, /* bExport= */ true);
