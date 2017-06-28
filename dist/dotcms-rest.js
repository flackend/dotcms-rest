"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * @author Jared Flack <jared@ethode.com>
 * @date March 11, 2015
 */

var DotcmsRest = (function () {
    function DotcmsRest(config) {
        _classCallCheck(this, DotcmsRest);

        this.debug = config.debug || false;
        this.config = config;
        this.idCounter = 0;
        this.identifierLock = [];
    }

    _createClass(DotcmsRest, {
        createContentlet: {

            /**
             * Creates a new contentlent.
             * @param  string   method    save|publish
             * @param  string   structure The structure the contentlet belongs to.
             * @param  object   data      The contentlet's parameters.
             * @param  function callback  The function that will be called when the
             * transaction has completed.
             * @param boolean
             */

            value: function createContentlet(method, structure, data, callback) {
                var _this = this;

                // Validate the structure and data parameters
                if (structure === undefined) {
                    this.log("You must specify a structure.", "error");
                    return false;
                } else if (data === undefined || Object.getOwnPropertyNames(data).length < 1) {
                    this.log("No data was passed.", "error");
                    return false;
                }

                // We set the structure field name by determining if the structure
                // was passed as an identifier or a name
                data[this.isIdentifier(structure) ? "stId" : "stName"] = structure;

                var id = ++this.idCounter;

                this.log("[" + id + "] Starting contentlet " + method + " to server.", "debug");

                jQuery.ajax({
                    url: "/api/content/" + method + "/1",
                    type: "PUT",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (data) {
                        _this.log("[" + id + "] Completed successfully!", "success");
                        if (typeof callback === "function") {
                            callback();
                        }
                    },
                    error: function () {
                        _this.log("[" + id + "] Did not complete successfully.", "error");
                    }
                });
            }
        },
        getContentlet: {

            /**
             * Retreives contentlet for the supplied identifier and passes it to the callback function.
             * @param  string   identifier Identifier of the contentlet to be retrieved.
             * @param  function callback   Function that is called once the contentlet has been retrieved.
             */

            value: function getContentlet(identifier, callback) {
                jQuery.ajax({
                    url: "/api/content/id/" + identifier,
                    dataType: "JSON",
                    success: function (data) {
                        if (typeof callback === "function") {
                            callback(data.contentlets[0] || false);
                        }
                    }
                });
            }
        },
        isIdentifier: {

            /**
             * Determines if a string matches the pattern of a dotCMS identifier (UUID).
             * @param  string  str The string that will be tested.
             * @return boolean
             */

            value: function isIdentifier(str) {
                return !!str.match(/^[0-9a-f]{18}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            }
        },
        log: {

            /**
             * Logs a message to the console.
             * @param  string msg  The message to log.
             * @param  string type The type of message. Changes the color.
             * @return
             */

            value: function log(msg, type) {
                if (!this.debug) {
                    return false;
                }
                var baseCss = "padding: 4px 4px; color: white; line-height: 1.8em; border-radius: 1px;";
                msg = "%c" + msg;
                switch (type) {
                    case "primary":
                    case "debug":
                        return console.log(msg, baseCss + "background-color: #428bca;");
                    case "info":
                        return console.log(msg, baseCss + "background-color: #5bc0de;");
                    case "error":
                    case "danger":
                        return console.log(msg, baseCss + "background-color: #d9534f;");
                    case "success":
                        return console.log(msg, baseCss + "background-color: #5cb85c;");
                    case "warning":
                        return console.log(msg, baseCss + "background-color: #f0ad4e;");
                    case undefined:
                    case "default":
                        return console.log(msg, "padding: 4px 4px; line-height: 1.8em;");
                    default:
                        return console.log(msg, "padding: 4px 4px; line-height: 1.8em;");
                }
            }
        },
        publishContentlet: {

            /**
             * Publishes a new contentlent.
             * @param  string   structure The structure the contentlet belongs to.
             * @param  object   data      The contentlet's parameters.
             * @param  function callback  The function that will be called when the
             * transaction has completed.
             */

            value: function publishContentlet(structure, data, callback) {
                return this.createContentlet("publish", structure, data, callback);
            }
        },
        query: {

            /**
             * Queries for contentlets.
             *
             * This function could likely be made a lot easier to work with by replacing
             * the query param with structure and data params. Though you'd need a list
             * of the global params that wouldn't need to be prefixed with the structure
             * name (e.g. deleted, working, languageId). You would be required to pass
             * in a structure name that would be used to prefix (e.g. "+Blog.title:How
             * to *"). Consideration should be made in regards to the "/stInode/xxxx"
             * which assumably lets you query reults that were published to a specific
             * structure version (would be valuable if you want to only fetch updated
             * contentlets). I'm not sure how you would make handle dates. Maybe have
             * another function, `queryWithDate` or something, that take two additional
             * params.
             * @param  string   query    A lucene query string
             * @param  object   options  A map of options. Available keys are orderBy,
             * limit, offset, and render.
             * @param  function callback The function that will be called when the
             * transaction has completed and will receive the query results.
             */

            value: (function (_query) {
                var _queryWrapper = function query(_x, _x2, _x3) {
                    return _query.apply(this, arguments);
                };

                _queryWrapper.toString = function () {
                    return _query.toString();
                };

                return _queryWrapper;
            })(function (query, options, callback) {
                var availableOptions = ["limit", "offset", "orderBy", "render"];
                var queryString = "";
                availableOptions.forEach(function (option) {
                    if (options[option]) {
                        queryString += "" + option + "/" + options[option];
                    }
                });
                jQuery.ajax({
                    url: "/api/content/query/" + query + "/" + queryString,
                    dataType: "JSON",
                    success: function (data) {
                        if (typeof callback === "function") {
                            callback(data.contentlets || false);
                        }
                    }
                });
            })
        },
        removeLock: {

            /**
             * Removes the lock on an identifier.
             * @param  string identifier The Contentlet identifier to remove.
             * @return boolean
             */

            value: function removeLock(identifier) {
                return !!this.identifierLock.splice(this.identifierLock.indexOf(identifier), 1);
            }
        },
        saveContentlet: {

            /**
             * Saves a new contentlent without publishing it.
             * @param  string   structure The structure the contentlet belongs to.
             * @param  object   data      The contentlet's parameters.
             * @param  function callback  The function that will be called when the
             * transaction has completed.
             */

            value: function saveContentlet(structure, data, callback) {
                return this.createContentlet("save", structure, data, callback);
            }
        },
        updateContentlet: {

            /**
             * Updates a contentlet.
             * @param  string   identifier The contentlet's identifier.
             * @param  string   structure  The contentlet's structure name or structure identifier.
             * @param  object   data       The data to change on the contentlet.
             * @param  function callback   Function that is called after the update has completed.
             * @return boolean Returns false if the record has been locked.
             */

            value: function updateContentlet(identifier, structure, data, callback, id) {
                var _this = this;

                // Validate parameters
                if (identifier === undefined) {
                    this.log("You must specify an identifier.", "error");
                    return false;
                } else if (structure === undefined) {
                    this.log("You must specify a structure.", "error");
                    return false;
                } else if (data === undefined || Object.getOwnPropertyNames(data).length < 1) {
                    this.log("No data was passed.", "error");
                    return false;
                }

                // Manage Contentlet locking
                if (this.identifierLock.indexOf(identifier) !== -1) {
                    this.log("Lock exists for " + identifier + ".", "error");
                    return false;
                } else {
                    this.identifierLock.push(identifier);
                }

                // Set id
                if (id === undefined) {
                    id = ++this.idCounter;
                }

                // Add the identifier and structure to the data payload
                data.identifier = identifier;
                // We set the structure field name by determining if the structure
                // was passed as an identifier or a name
                data[this.isIdentifier(structure) ? "stId" : "stName"] = structure;

                this.log("[" + id + "] Started.", "debug");

                jQuery.ajax({
                    url: "/api/content/publish/1",
                    type: "PUT",
                    data: data,
                    success: function () {
                        // Log it!
                        _this.log("[" + id + "] Contentlet update successful.", "success");
                        // Fire the callback function
                        if (typeof callback === "function") {
                            callback();
                        }
                        // Remove the lock on the identifier
                        _this.removeLock(identifier);
                    },
                    error: function () {
                        _this.log("[" + id + "] Contentlet update unsuccessful.", "error");
                        // Remove the lock on the identifier
                        _this.removeLock(identifier);
                    }
                });

                return true;
            }
        },
        updateContentlets: {

            /**
             * Updates a collection of contentlets one at a time.
             * @param  array    identifiers An array of contentlet identifiers (strings).
             * @param  string   structure   The structure name or structure identifier the contentlets belong to.
             * @param  object   data        The data to change on the contentlets.
             * @param  function callback    Function that is called after the updates have all completed.
             */

            value: function updateContentlets(identifiers, structure, data, callback) {
                var _this = this;

                var count = identifiers.length,
                    current = 0,
                    main = function (current) {

                    // Build the ID
                    var id = "" + (current + 1) + "/" + count;

                    _this.updateContentlet(identifiers[current], structure, data, function () {
                        if (current + 1 < count) {
                            main(++current);
                        } else if (typeof callback === "function") {
                            callback(current, count);
                        }
                    }, id);
                };
                // Start!
                main(current);
            }
        }
    });

    return DotcmsRest;
})();
