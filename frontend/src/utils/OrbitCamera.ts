import * as pc from 'playcanvas';

/**
 * OrbitCamera - 球面座標系によるカメラコントローラー
 * マウスとタッチによる直感的なカメラ操作を提供
 */
class OrbitCamera {
  private camera: pc.Entity;
  private target: pc.Vec3;
  private distance: number;
  private pitch: number; // 度数法
  private yaw: number;   // 度数法

  // 初期状態の保存
  private initialState = {
    target: new pc.Vec3(0, 0, 0),
    distance: 5,
    pitch: 0,
    yaw: 0
  };

  private isDragging: boolean = false;
  private isPanning: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  private touchDistance: number = 0;

  // 設定
  private rotationSpeed: number = 0.3;
  private panSpeed: number = 0.002;
  private zoomSpeed: number = 0.002;

  // 制限
  private minDistance: number = 1;
  private maxDistance: number = 100;
  private minPitch: number = -Infinity;
  private maxPitch: number = Infinity;

  constructor(camera: pc.Entity, targetPosition: pc.Vec3 = new pc.Vec3(0, 0, 0)) {
    this.camera = camera;
    this.target = targetPosition.clone();

    // 初期カメラ位置から距離とアングルを計算
    const cameraPos = camera.getPosition();
    const offset = new pc.Vec3();
    offset.sub2(cameraPos, this.target);

    this.distance = offset.length();
    this.pitch = Math.acos(offset.y / this.distance) * (180 / Math.PI) - 90;
    this.yaw = Math.atan2(offset.x, offset.z) * (180 / Math.PI);

    this.updateCameraPosition();
  }

  /**
   * マウスイベントのセットアップ
   */
  setupMouseEvents(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('wheel', this.onWheel.bind(this));
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * タッチイベントのセットアップ
   */
  setupTouchEvents(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  /**
   * マウスダウン
   */
  private onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.isPanning = event.shiftKey;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  /**
   * マウスムーブ
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.lastMouseX;
    const deltaY = event.clientY - this.lastMouseY;

    if (this.isPanning) {
      // パン（ターゲット位置の移動）
      const right = this.camera.right.clone();
      const up = this.camera.up.clone();

      right.mulScalar(-deltaX * this.panSpeed * this.distance);
      up.mulScalar(deltaY * this.panSpeed * this.distance);

      this.target.add(right);
      this.target.add(up);
    } else {
      // 回転
      this.yaw += deltaX * this.rotationSpeed;
      this.pitch -= deltaY * this.rotationSpeed;

      // ピッチの制限（制限値が有限の場合のみ適用）
      if (isFinite(this.minPitch) && isFinite(this.maxPitch)) {
        this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
      }
    }

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    this.updateCameraPosition();
  }

  /**
   * マウスアップ
   */
  private onMouseUp(): void {
    this.isDragging = false;
    this.isPanning = false;
  }

  /**
   * マウスホイール（ズーム）
   */
  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    this.distance += event.deltaY * this.zoomSpeed * this.distance;
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));

    this.updateCameraPosition();
  }

  /**
   * タッチスタート
   */
  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();

    if (event.touches.length === 1) {
      // 1本指 - 回転
      this.isDragging = true;
      this.lastMouseX = event.touches[0].clientX;
      this.lastMouseY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
      // 2本指 - ピンチズーム
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.touchDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  /**
   * タッチムーブ
   */
  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();

    if (event.touches.length === 1 && this.isDragging) {
      // 回転
      const deltaX = event.touches[0].clientX - this.lastMouseX;
      const deltaY = event.touches[0].clientY - this.lastMouseY;

      this.yaw += deltaX * this.rotationSpeed;
      this.pitch -= deltaY * this.rotationSpeed;

      // ピッチの制限（制限値が有限の場合のみ適用）
      if (isFinite(this.minPitch) && isFinite(this.maxPitch)) {
        this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
      }

      this.lastMouseX = event.touches[0].clientX;
      this.lastMouseY = event.touches[0].clientY;

      this.updateCameraPosition();
    } else if (event.touches.length === 2) {
      // ピンチズーム
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const delta = this.touchDistance - distance;
      this.distance += delta * this.zoomSpeed * 2;
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));

      this.touchDistance = distance;

      this.updateCameraPosition();
    }
  }

  /**
   * タッチエンド
   */
  private onTouchEnd(): void {
    this.isDragging = false;
    this.touchDistance = 0;
  }

  /**
   * カメラ位置を更新
   */
  private updateCameraPosition(): void {
    // 度数法から弧度法に変換
    const pitchRad = this.pitch * pc.math.DEG_TO_RAD;
    const yawRad = this.yaw * pc.math.DEG_TO_RAD;

    // 球面座標系でカメラ位置を計算
    const x = this.target.x + this.distance * Math.sin(yawRad) * Math.cos(pitchRad);
    const y = this.target.y + this.distance * Math.sin(pitchRad);
    const z = this.target.z + this.distance * Math.cos(yawRad) * Math.cos(pitchRad);

    this.camera.setPosition(x, y, z);

    // 正しいアップベクトルを計算（ジンバルロック回避のため）
    // アップベクトルは視線方向に垂直で、カメラ空間の「上」を指す
    // オービットカメラでは、球面座標系から導出する

    // "右"ベクトルを計算（yaw回転軸に垂直）
    const rightX = Math.cos(yawRad);
    const rightY = 0;
    const rightZ = -Math.sin(yawRad);

    // "前方"ベクトルを計算（カメラからターゲットへ）
    const forwardX = this.target.x - x;
    const forwardY = this.target.y - y;
    const forwardZ = this.target.z - z;

    // アップベクトル = 前方 × 右（外積）
    const upX = forwardY * rightZ - forwardZ * rightY;
    const upY = forwardZ * rightX - forwardX * rightZ;
    const upZ = forwardX * rightY - forwardY * rightX;

    const up = new pc.Vec3(upX, upY, upZ).normalize();

    // 計算したアップベクトルを使用してジンバルロックを回避
    this.camera.lookAt(this.target, up);
  }

  /**
   * ターゲット位置を設定
   */
  setTarget(target: pc.Vec3): void {
    this.target = target.clone();
    this.updateCameraPosition();
  }

  /**
   * カメラ距離を設定
   */
  setDistance(distance: number): void {
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, distance));
    this.updateCameraPosition();
  }

  /**
   * カメラアングルを設定
   */
  setAngles(pitch: number, yaw: number): void {
    this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, pitch));
    this.yaw = yaw;
    this.updateCameraPosition();
  }

  /**
   * カメラをリセット
   */
  reset(target?: pc.Vec3, distance?: number, pitch?: number, yaw?: number): void {
    if (target) this.target = target.clone();
    if (distance !== undefined) this.distance = distance;
    if (pitch !== undefined) this.pitch = pitch;
    if (yaw !== undefined) this.yaw = yaw;

    this.updateCameraPosition();
  }

  /**
   * 現在のカメラ状態を初期状態として保存
   */
  saveInitialState(): void {
    this.initialState.target = this.target.clone();
    this.initialState.distance = this.distance;
    this.initialState.pitch = this.pitch;
    this.initialState.yaw = this.yaw;
  }

  /**
   * カメラを初期状態にリセット
   */
  resetToInitial(): void {
    this.reset(
      this.initialState.target,
      this.initialState.distance,
      this.initialState.pitch,
      this.initialState.yaw
    );
  }
}

export default OrbitCamera;
