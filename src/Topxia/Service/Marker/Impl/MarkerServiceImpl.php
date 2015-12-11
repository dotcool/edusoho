<?php

namespace Topxia\Service\Marker\Impl;

use Topxia\Common\ArrayToolkit;
use Topxia\Service\Common\BaseService;

class MarkerServiceImpl extends BaseService implements MarkerService
{
    public function getMarker($id)
    {
        return $this->getMarkerDao()->getMarker($id);
    }

    public function getMarkersByIds($ids)
    {
        $markers = $this->getMarkerDao()->getMarkersByIds($ids);
        return ArrayToolkit::index($markers, 'id');
    }

    public function searchMarkers($conditions, $orderBy, $start, $limit)
    {
        $conditions = $this->prepareMarkerConditions($conditions);
        return $this->getMarkerDao()->searchMarkers($conditions, $orderBy, $start, $limit);
    }

    public function updateMarker($id, $fields)
    {
        if (isset($fields['updateTime']) || $fields['updateTime'] == "") {
            $fields['updateTime'] = time();
        }

        return $this->getMarkerDao()->updateMarker($id, $fields);
    }

    public function addMarker($mediaId, $fields)
    {
        $media = $this->getUploadFileService()->getFile($midiaId);

        if (empty($midiaId) || empty($media)) {
            throw $this->createServiceException("视频文件不存在！");
        }

        if (!isset($fields['second']) || $fields['second'] == "") {
            throw $this->createServiceException("请输入弹题时间！");
        }

        $marker = array(
            'mediaId'     => $mediaId,
            'createdTime' => time(),
            'updateTime'  => time(),
            'second'      => $fields['second']
        );

        return $this->getMarkerDao()->addMarker($marker);
    }

    public function deleteMarker($id)
    {
        $marker = $this->getMarker($id);

        if (empty($marker)) {
            throw $this->createServiceException("弹题不存在，操作失败。");
        }

        $this->getMarkerDao()->deleteMarker($id);
        $this->getLogService()->info('Marker', 'delete', "弹题#{$id}永久删除");

        return true;
    }

    protected function prepareMarkerConditions($conditions)
    {
        if (isset($conditions['second']) && $conditions['second'] == "") {
            unset($conditions['second']);
        }

        return $conditions;
    }

    protected function getMarkerDao()
    {
        return $this->createDao('Marker.MarkerDao');
    }

    protected function getUploadFileService()
    {
        return $this->createService('File.UploadFileService');
    }
}
