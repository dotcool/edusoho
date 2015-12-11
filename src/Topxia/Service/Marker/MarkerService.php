<?php

namespace Topxia\Service\Marker;

interface MarkerService
{
    public function getMarker($id);

    public function getMarkersByIds($ids);

    public function searchMarkers($conditions, $orderBy, $start, $limit);

    public function updateMarker($id, $fields);

    public function addMarker($fields);

    public function deleteMarker($id);
}
