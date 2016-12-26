(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueGrid/ueGrid.html',
    '\n' +
    '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n' +
    '    <div class="editor-header">\n' +
    '        <component-wrapper ng-if="vm.filterComponent" data-setting="vm.filterComponent" data-options="vm.options"></component-wrapper>\n' +
    '        <component-wrapper ng-repeat="button in vm.listHeaderBar track by $index" data-setting="button" data-button-class="header" data-options="vm.options" class="header-action-button">       </component-wrapper>\n' +
    '    </div>\n' +
    '    <div class="groups-action">\n' +
    '        <button data-ng-if="vm.parentButton &amp;&amp; !vm.options.isLoading" data-ng-click="vm.getParent()" class="btn btn-sm btn-default">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '    </div>\n' +
    '    <div data-ng-show="vm.request.isProcessing" class="processing-status-wrapper">\n' +
    '        <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '    </div>{{vm.request.isProcessing}}\n' +
    '    <table data-ng-hide="vm.options.isLoading" class="table table-bordered items-list">\n' +
    '        <thead>\n' +
    '            <tr>\n' +
    '                <td ng-if="vm.isContextMenu" class="actions-header context-column"></td>\n' +
    '                <td data-ng-repeat="fieldItem in vm.tableFields" data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}" data-ng-click="vm.changeSortField(fieldItem.field, fieldItem.sorted)">{{fieldItem.displayName}}</td>\n' +
    '            </tr>\n' +
    '        </thead>\n' +
    '        <tbody data-ng-if="vm.listLoaded">\n' +
    '            <tr data-ng-repeat="item in vm.items" data-ng-class="{\'zhs-item\' : item[vm.subType] &amp;&amp; item[vm.subType] !== undefined}" data-ng-mousedown="vm.toggleContextViewByEvent(item[vm.idField], $event)" oncontextmenu="return false;">\n' +
    '                <td ng-if="vm.isContextMenu" class="context-column"><span data-ng-click="vm.toggleContextView(item[vm.idField])" data-ng-show="(vm.contextLinks.length &amp;&amp; (item[vm.subType] || item[vm.subType] == undefined)) || (vm.mixContextLinks.length &amp;&amp; vm.entityType)" class="context-toggle">Toggle buttons</span>\n' +
    '                    <div data-ng-show="vm.contextId == item[vm.idField]" data-ng-style="vm.styleContextMenu" class="context-menu-wrapper">\n' +
    '                        <div data-ng-repeat="link in vm.contextLinks track by $index" data-ng-if="item[vm.subType] !== vm.entityType || !vm.isMixMode" data-ng-class="{\'component-separator\': link.separator}" class="context-menu-item">\n' +
    '                            <component-wrapper data-setting="link" data-entity-id="{{::item[vm.idField]}}" data-button-class="context" data-scope-id-parent="{{vm.scopeIdParent}}" data-options="vm.options"></component-wrapper>\n' +
    '                        </div>\n' +
    '                        <div data-ng-repeat="link in vm.mixContextLinks track by $index" data-ng-if="vm.entityType &amp;&amp; item[vm.subType] === vm.entityType" data-ng-class="{\'component-separator\': link.separator}" class="context-menu-item">\n' +
    '                            <component-wrapper data-setting="link" data-entity-id="{{::item[vm.idField]}}" data-button-class="context" data-scope-id-parent="{{vm.scopeIdParent}}" data-options="vm.mixOption"></component-wrapper>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td data-ng-repeat="fieldItem in vm.tableFields track by $index"><span data-ng-class="{\'glyphicon-folder-open icon-mix-mode\' : vm.isMixMode &amp;&amp; item[vm.subType] !== vm.entityType}" data-ng-if="vm.prependIcon === fieldItem.field" class="glyphicon"></span>\n' +
    '                    <component-wrapper data-setting="fieldItem.component" data-options="item.$options" ng-style="{\'padding-left\': (item.parentPadding || 0) * 10 + \'px\'}"></component-wrapper>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '            <tr data-ng-if="vm.items.length == 0">\n' +
    '                <td colspan="{{vm.tableFields.length + vm.isContextMenu}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '        <tfoot>\n' +
    '            <tr>\n' +
    '                <td colspan="{{vm.tableFields.length + vm.isContextMenu}}">\n' +
    '                    <component-wrapper data-ng-repeat="component in vm.listFooterBar track by $index" data-setting="component" data-options="vm.options"></component-wrapper>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tfoot>\n' +
    '    </table>\n' +
    '</div>');
}]);
})();
