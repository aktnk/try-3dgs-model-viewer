import React, { useEffect, useRef, useState } from 'react';
import * as pc from 'playcanvas';
import OrbitCamera from '../utils/OrbitCamera';

interface GaussianSplatViewerProps {
  modelUrl?: string;
  onLoadError?: (error: Error) => void;
  onLoadSuccess?: () => void;
}

/**
 * GaussianSplatViewer - PlayCanvasを使用した3DGSモデルビューア
 */
const GaussianSplatViewer: React.FC<GaussianSplatViewerProps> = ({
  modelUrl,
  onLoadError,
  onLoadSuccess
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<pc.Application | null>(null);
  const orbitCameraRef = useRef<OrbitCamera | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // PlayCanvasアプリケーションの初期化
    const app = new pc.Application(canvasRef.current, {
      mouse: new pc.Mouse(canvasRef.current),
      touch: new pc.TouchDevice(canvasRef.current),
      keyboard: new pc.Keyboard(window),
    });

    appRef.current = app;

    // キャンバス設定
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // カメラエンティティの作成
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      clearColor: new pc.Color(0.1, 0.1, 0.1),
      farClip: 1000,
      fov: 60,
    });
    camera.setPosition(0, 0, 5);
    app.root.addChild(camera);

    // ライトの作成
    const light = new pc.Entity('light');
    light.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 1, 1),
      intensity: 1,
    });
    light.setEulerAngles(45, 45, 0);
    app.root.addChild(light);

    // アンビエントライト
    const ambientLight = new pc.Entity('ambientLight');
    ambientLight.addComponent('light', {
      type: 'ambient',
      color: new pc.Color(0.3, 0.3, 0.3),
    });
    app.root.addChild(ambientLight);

    // OrbitCameraの初期化
    const orbitCamera = new OrbitCamera(camera, new pc.Vec3(0, 0, 0));
    orbitCamera.setDistance(5);
    orbitCamera.setAngles(-14, 45);
    orbitCamera.setupMouseEvents(canvasRef.current);
    orbitCamera.setupTouchEvents(canvasRef.current);
    orbitCameraRef.current = orbitCamera;

    // アプリケーション開始
    app.start();

    // クリーンアップ
    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, []);

  // モデルのロード
  useEffect(() => {
    if (!modelUrl || !appRef.current) return;

    const app = appRef.current;
    setIsLoading(true);

    // 既存のモデルを削除
    const existingModel = app.root.findByName('GaussianSplat');
    if (existingModel) {
      existingModel.destroy();
    }

    // ファイル拡張子を確認
    const extension = modelUrl.split('.').pop()?.toLowerCase();
    if (!['ply', 'sog', 'splat'].includes(extension || '')) {
      const error = new Error('Invalid file format. Only .ply, .sog, and .splat files are supported.');
      console.error(error);
      setIsLoading(false);
      if (onLoadError) onLoadError(error);
      return;
    }

    // アセットの作成
    const asset = new pc.Asset('GaussianSplatAsset', 'gsplat', {
      url: modelUrl,
      filename: modelUrl.split('/').pop() || 'model.ply',
    });

    // ロード成功時
    asset.on('load', () => {
      try {
        const entity = new pc.Entity('GaussianSplat');
        entity.addComponent('gsplat', {
          asset: asset,
        });
        app.root.addChild(entity);

        setIsLoading(false);
        if (onLoadSuccess) onLoadSuccess();
      } catch (error) {
        console.error('Error adding gsplat component:', error);
        setIsLoading(false);
        if (onLoadError) onLoadError(error as Error);
      }
    });

    // ロードエラー時
    asset.on('error', (err) => {
      console.error('Asset load error:', err);
      setIsLoading(false);
      if (onLoadError) onLoadError(new Error(`Failed to load model: ${err}`));
    });

    // アセットをアプリに追加してロード
    app.assets.add(asset);
    app.assets.load(asset);

  }, [modelUrl, onLoadError, onLoadSuccess]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
        }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '18px',
          }}
        >
          モデルを読み込んでいます...
        </div>
      )}
    </div>
  );
};

export default GaussianSplatViewer;
